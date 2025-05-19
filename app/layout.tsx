import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  ClerkProvider,
  /*  SignInButton,
  SignedIn,
  SignedOut,
  UserButton, */
} from "@clerk/nextjs";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="de">
        <body>
          <Header />
          {/* <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn> */}
          <main className=" pt-16 min-h-screen">{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
