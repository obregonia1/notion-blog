import Header from '../components/header'
import ExtLink from '../components/ext-link'
import Features from '../components/features'
import sharedStyles from '../styles/shared.module.css'

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
          <li>🛹スケートボード</li>
          <li>👖Gangsterville</li>
          <li>📀スクラッチ</li>
          <li>🎧HIPHOP</li>
          <li>💪筋トレ</li>
        </ul>
      </div>
    </>
  )
}
