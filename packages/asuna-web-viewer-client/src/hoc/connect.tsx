import m from 'mithril'
import { MithrilTsxComponent } from 'mithril-tsx-component'
import store, { RootState } from '../store/store'

export default function (Component: typeof MithrilTsxComponent) {
  return function (mapAttrs?: (state: RootState) => object) {
    return class extends MithrilTsxComponent<any> {
      view({ attrs, children }: m.Vnode) {
        const storeAttrs = mapAttrs === undefined ? null : mapAttrs(store.getState())
        return <Component {...attrs} {...storeAttrs} dispatch={store.dispatch}>{children}</Component>
      }
    }
  }
}
