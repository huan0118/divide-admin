import type { App, Component } from 'vue'
const modulesFiles = import.meta.glob('@/components/**/*.tsx', { import: 'default', eager: true })

export default (app: App) => {
  for (const path in modulesFiles) {
    const component = modulesFiles[path] as Component
    if (component.name) {
      app.component(component.name, component)
    }
  }
}
