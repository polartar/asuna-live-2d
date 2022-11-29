import connect from './connect'
import m from 'mithril'
import { MithrilTsxComponent } from 'mithril-tsx-component'

// TODO: deal with component genric types
// TODO: clean up class types
// TODO: add types to functions
// TODO: make upgrades into registry

export type Wrapper = (c: typeof WrappedComponent) => (...args: any[]) => typeof WrappedComponent
export type Upgrade = (...args: any[]) => typeof WrappedComponent
export class WrappedComponent extends MithrilTsxComponent<any> {
  static connect: ReturnType<typeof connect>
  view(vnode: m.Vnode<any, this>) { }
}

const wrappers: { [name: string]: Wrapper } = {
  'connect': connect as Wrapper
}

export default (component: new () => MithrilTsxComponent<any>): typeof WrappedComponent => {
  let upgrade: { [name: string]: Upgrade } = {}

  for (let name of Object.keys(wrappers)) {
    upgrade[name] = function (...args: any[]) {
      let wrapped = wrappers[name](this as any)(...args)
      Object.assign(wrapped, upgrade)
      return wrapped
    }
  }

  Object.assign(component, upgrade)
  return component as typeof WrappedComponent
}
