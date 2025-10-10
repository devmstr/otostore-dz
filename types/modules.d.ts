// types/modules.d.ts
declare module '*.css'
declare module '*.scss'
declare module '*.sass'
declare module '*.png'
declare module '*.jpg'
declare module '*.svg' {
  import * as React from 'react'
  const content: React.FC<React.SVGProps<SVGSVGElement>>
  export default content
}
