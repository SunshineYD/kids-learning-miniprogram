/// &lt;reference types="vite/client" /&gt;

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent&lt;{}, {}, any&gt;
  export default component
}

declare namespace UniApp {
  interface Uni {
    $u: any
  }
}
