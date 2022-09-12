import ConsoleLayout from './ConsoleLayout'
import ConsolePageLayout from './ConsolePageLayout'

const Layouts = {}
Layouts.install = Vue => {
  Vue.component(ConsoleLayout.name, ConsoleLayout)
  Vue.component(ConsolePageLayout.name, ConsolePageLayout)
}

export default Layouts
