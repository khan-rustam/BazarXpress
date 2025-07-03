import type { ReactNode } from "react"
import Footer from "./footer"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-surface-primary">
      <main className="">{children}</main>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  )
}
