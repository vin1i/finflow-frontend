import { RegisterForm } from "@/app/components/auth/register/register-form"
import { GalleryVerticalEnd } from "lucide-react"
import Image from "next/image"


export default function RegisterPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            FinFlow.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <RegisterForm/>
          </div>
        </div>
      </div>
    <div className="relative hidden bg-muted lg:flex items-center justify-center">
  <div className="max-w-md w-full px-6">
    <Image
      src="/images/undraw_wallet_diag.svg"
      alt="Image"
      width={600}
      height={400}
      className="object-contain w-full h-auto dark:brightness-[0.2] dark:grayscale"
    />
  </div>
</div>
    </div>
  )
}
