import m from 'mithril'
import { MithrilTsxComponent } from 'mithril-tsx-component'
import store, { RootState } from '../store/store'
import { WrappedComponent } from './upgrade'

export default function (Component: typeof WrappedComponent) {
  return function (mapAttrs?: (state: RootState) => object) {
    return class extends WrappedComponent {
      view({ attrs, children }: m.Vnode) {
        const storeAttrs = mapAttrs === undefined ? null : mapAttrs(store.getState())
        return <Component {...attrs} {...storeAttrs} dispatch={store.dispatch}>{children}</Component>
      }
    } as typeof WrappedComponent
  }
}
