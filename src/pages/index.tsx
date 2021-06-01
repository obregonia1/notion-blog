import Header from '../components/header'
import ExtLink from '../components/ext-link'
import Features from '../components/features'
import sharedStyles from '../styles/shared.module.css'

export default function Index() {
  return (
    <>
      <Header titlePre="Home" />
      <div className={sharedStyles.layout}>
        <img
          src="/vercel-and-notion.png"
          height="85"
          width="250"
          alt="Vercel + Notion"
        />
        <h1>Code Rules Everything Around Me</h1>

        <p>
          <a href="https://bootcamp.fjord.jp/">フィヨルドブートキャンプ</a>
          でプログラミング勉強中
        </p>
      </div>
    </>
  )
}
