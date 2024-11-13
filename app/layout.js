import "./globals.css";
import SessionWrapper from "../Providers/SessionWrapper";
import ParentFolderIdContextWrapper from "@/Providers/ParentFolderIdContextWrapper";
import FolderRefreshContextWrapper from "@/Providers/FolderRefreshContextWrapper";
import FileRefreshContextWrapper from "@/Providers/FileRefreshContextWrapper";
import ChildrenProvider from "@/Providers/ChildrenProvider";
import StorageContextWrapper from "@/Providers/StorageContextWrapper";

export const metadata = {
  title: "Cloud Box",
  description: "Cloud Storage Web App",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionWrapper>
          <ParentFolderIdContextWrapper>
            <FolderRefreshContextWrapper>
              <FileRefreshContextWrapper>
                <StorageContextWrapper>
                  <ChildrenProvider children={children} />
                  {/* <div className="flex">
                  <SideNavBar />
                  <div className="grid grid-cols-1 md:grid-cols-3 w-full">
                    <div className="col-span-2">{children}</div>
                    <div className="order-first md:order-last ">
                      <Storage />
                    </div>
                  </div>
                </div> */}
                </StorageContextWrapper>
              </FileRefreshContextWrapper>
            </FolderRefreshContextWrapper>
          </ParentFolderIdContextWrapper>
        </SessionWrapper>
      </body>
    </html>
  );
}

