import { SplineSceneDemo } from "@/components/demo/spline-scene-demo"
import Navbar from "@/components/layout/Navbar"

export default function Home() {
  return (
    <main className="bg-gradient-mesh text-white min-h-screen relative overflow-hidden">
<div className="absolute inset-0 bg-gradient-radial from-primary-500/10 to-transparent opacity-50"></div>
<Navbar />
<MyNewComponent />
    </main>
  )
}
