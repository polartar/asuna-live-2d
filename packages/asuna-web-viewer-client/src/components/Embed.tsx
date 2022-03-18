import m from 'mithril'
import { MithrilTsxComponent } from 'mithril-tsx-component'
import { Dispatch } from '../store/store'
import { setIFrameElement } from '../store/iframe'
import upgrade from '../hoc/upgrade'

export type EmbedAttrs = {
  dispatch: Dispatch
}

class Embed extends MithrilTsxComponent<any> {
  oncreate({ attrs }: m.VnodeDOM<EmbedAttrs>) {
    attrs.dispatch(setIFrameElement(document.getElementById('iframe') as HTMLIFrameElement))
  }

  view() {
    return <div class='embed bg-dark-900'>
      <iframe id='iframe' allow="accelerometer; autoplay  ; encrypted-media; gyroscope; picture-in-picture" frameborder="0"
        height="100%" src="/embed" width="100%" sandbox="allow-scripts allow-same-origin" style="min-height: 750px; position:relative; top:-119px;"></iframe>
    </div>
  }
}

export default upgrade(Embed)
  .connect()
