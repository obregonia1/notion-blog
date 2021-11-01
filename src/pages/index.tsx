import Header from '../components/header'
import ExtLink from '../components/ext-link'
import Features from '../components/features'
import sharedStyles from '../styles/shared.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter, faGithub } from '@fortawesome/free-brands-svg-icons'

export default function Index() {
  return (
    <>
      <Header titlePre="Home" />
      <div className={sharedStyles.layout}>
        <h1>Code Rules Everything Around Me</h1>

        <ul className={sharedStyles.layout}>
          <li>
            <a href="https://bootcamp.fjord.jp/">フィヨルドブートキャンプ</a>
          </li>
          <li>ジョジョの奇妙な冒険</li>
          <li>
            <a href="https://visible-scratch-skillz.net">
              Visible Scratch Skillz
            </a>
          </li>
          <li>🛹スケートボード</li>
          <li>👖Gangsterville</li>
          <li>📀スクラッチ</li>
          <li>🎧HIPHOP</li>
          <li>💪筋トレ</li>
        </ul>

        <hr />

        <ul className={sharedStyles.layout}>
          <li>
            <a href="https://speakerdeck.com/obregonia1">Speaker Deck</a>
          </li>
          <li>
            <a href="https://www.doorkeeper.jp/users/obregonia1">Doorkeeper</a>
          </li>
          <li>
            <a href="https://connpass.com/user/obregonia1/">connpass</a>
          </li>
          <li>
            <a href="https://zenn.dev/obregonia1/">Zenn</a>
          </li>
        </ul>
        <div className={sharedStyles.layout}>
          <a
            href="https://twitter.com/obregonia1"
            className={sharedStyles.layout}
          >
            <FontAwesomeIcon icon={faTwitter} />
          </a>
          <a
            href="https://github.com/obregonia1"
            className={sharedStyles.layout}
          >
            <FontAwesomeIcon icon={faGithub} />
          </a>
        </div>
      </div>
    </>
  )
}
