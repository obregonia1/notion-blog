import Link from 'next/link'
import fetch from 'node-fetch'
import { useRouter } from 'next/router'
import Header from '../../components/header'
import Heading from '../../components/heading'
import components from '../../components/dynamic'
import ReactJSXParser from '@zeit/react-jsx-parser'
import blogStyles from '../../styles/blog.module.css'
import React, { CSSProperties, useEffect } from 'react'
import Image from 'next/image'

import { getBlogLink, getTagLink } from '../../lib/blog-helpers'
import { textBlock } from '../../lib/notion/renderers'
import {
  getPosts,
  getAllPosts,
  getPostBySlug,
  getAllTags,
  getAllBlocksByPageId,
} from '../../lib/notion/client'

// Get the data for each blog post
export async function getStaticProps({ params: { slug } }) {
  const post = await getPostBySlug(slug)

  if (!post) {
    console.log(`Failed to find post for slug: ${slug}`)
    return {
      props: {
        redirect: '/blog',
      },
      revalidate: 30,
    }
  }

  const blocks = await getAllBlocksByPageId(post.PageId)
  const recentPosts = await getPosts(5)
  const tags = await getAllTags()

  return {
    props: {
      post,
      blocks,
      recentPosts,
      tags,
    },
    revalidate: 10,
  }
}

// Return our list of blog posts to prerender
export async function getStaticPaths() {
  const posts = await getAllPosts()
  // we fallback for any unpublished posts to save build time
  // for actually published ones
  return {
    paths: posts.map((post) => getBlogLink(post.Slug)),
    fallback: true,
  }
}

const listTypes = new Set(['bulleted_list', 'numbered_list'])

const RenderPost = ({ post, blocks = [], tags = [], redirect }) => {
  const router = useRouter()

  let listTagName: string | null = null
  let listLastId: string | null = null
  let listMap: {
    [id: string]: {
      key: string
      isNested?: boolean
      nested: string[]
      children: React.ReactFragment
    }
  } = {}

  useEffect(() => {
    if (redirect && !post) {
      router.replace(redirect)
    }
  }, [redirect, post])

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  // if you don't have a post at this point, and are not
  // loading one from fallback then  redirect back to the index
  if (!post) {
    return (
      <div className={blogStyles.post}>
        <p>
          Woops! didn't find that post, redirecting you back to the blog index
        </p>
      </div>
    )
  }

  return (
    <>
      <Header titlePre={post.Title} />
      <div className={blogStyles.post}>
        {post.Date && <div className="posted">📅&nbsp;&nbsp;{post.Date}</div>}
        <h1>{post.Title || ''}</h1>
        <div className={blogStyles.tagContainer}>
          {post.Tags &&
            post.Tags.length > 0 &&
            post.Tags.map((tag) => (
              <Link
                href="/blog/tag/[tag]"
                as={getTagLink(tag)}
                key={tag}
                passHref
              >
                <a className={blogStyles.tag}>🔖{tag}</a>
              </Link>
            ))}
        </div>
        <hr />

        {blocks.length === 0 && <p>This post has no content</p>}

        {blocks.map((block, blockIdx) => {
          // const {value} = block
          // const {type, properties, id, parent_id} = value
          const isLast = blockIdx === blocks.length - 1
          const isList =
            block.Type === 'bulleted_list_item' ||
            block.Type === 'numbered_list_item'
          let toRender = []
          let richText

          if (!!block.RichTexts && block.RichTexts.length > 0) {
            richText = block.RichTexts[0]
          }

          if (isList) {
            listTagName =
              components[block.Type === 'bulleted_list_item' ? 'ul' : 'ol']
            listLastId = `list${block.id}`

            listMap[block.id] = {
              key: block.id,
              nested: [],
              children: textBlock(block, true, block.Id),
            }
          }

          if (listTagName && (isLast || !isList)) {
            toRender.push(
              React.createElement(
                listTagName,
                { key: listLastId! },
                Object.keys(listMap).map((itemId) => {
                  if (listMap[itemId].isNested) return null

                  const createEl = (item) =>
                    React.createElement(
                      components.li || 'ul',
                      { key: item.key },
                      item.children,
                      item.nested.length > 0
                        ? React.createElement(
                            components.ul || 'ul',
                            { key: item + 'sub-list' },
                            item.nested.map((nestedId) =>
                              createEl(listMap[nestedId])
                            )
                          )
                        : null
                    )
                  return createEl(listMap[itemId])
                })
              )
            )
            listMap = {}
            listLastId = null
            listTagName = null
          }

          const renderHeading = (Type: string | React.ComponentType) => {
            if (!!richText) {
              toRender.push(
                <Heading key={block.Id}>
                  <Type key={block.Id}>{textBlock(block, true, block.Id)}</Type>
                </Heading>
              )
            }
          }

          switch (block.Type) {
            case 'paragraph':
              toRender.push(textBlock(block, false, block.Id))
              break
            case 'heading_1':
              renderHeading('h1')
              break
            case 'heading_2':
              renderHeading('h2')
              break
            case 'heading_3':
              renderHeading('h3')
              break
            case 'code':
              toRender.push(
                <components.Code key={block.Id} language={block.Language || ''}>
                  {block.Code.Text.map(
                    (richText) => richText.Text.Content
                  ).join('')}
                </components.Code>
              )
              break
            case 'quote':
              toRender.push(
                React.createElement(
                  components.blockquote,
                  { key: block.Id },
                  block.Quote.Text.map(
                    (richText) => richText.Text.Content
                  ).join('')
                )
              )
              break
            case 'image':
              toRender.push(
                <img src={block.Image.File.Url} alt="image in the content" />
              )
              if (
                block.Image.Caption.length > 0 &&
                block.Image.Caption[0].Text.Content
              ) {
                toRender.push(
                  <div className={blogStyles.caption}>
                    {block.Image.Caption[0].Text.Content}
                  </div>
                )
              }
              break
            default:
              if (
                process.env.NODE_ENV !== 'production' &&
                !(
                  block.Type === 'bulleted_list_item' ||
                  block.Type === 'numbered_list_item'
                )
              ) {
                console.log('unknown type', block.Type)
              }
              break
          }
          return toRender
        })}
      </div>
      <div className={blogStyles.tagIndex}>
        <h3>タグ</h3>
        <hr />
        {tags.length === 0 && (
          <div className={blogStyles.noTags}>There are no tags yet</div>
        )}
        {tags.length > 0 && (
          <ul>
            {tags.map((tag) => {
              return (
                <li key={tag}>
                  <Link href="/blog/tag/[tag]" as={getTagLink(tag)} passHref>
                    <a>{tag}</a>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </>
  )
}

export default RenderPost
