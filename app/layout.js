import "./globals.css";
import SessionWrapper from "../Providers/SessionWrapper";
import SideNavBar from "../Components/SideNavBar";
import ParentFolderIdContextWrapper from "@/Providers/ParentFolderIdContextWrapper";
import FolderRefreshContextWrapper from "@/Providers/FolderRefreshContextWrapper";
import FileRefreshContextWrapper from "@/Providers/FileRefreshContextWrapper";

export const metadata = {
  title: "Cloud Box",
  description: "Cloud Storage Web App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionWrapper>
          <ParentFolderIdContextWrapper>
            <FolderRefreshContextWrapper>
              <FileRefreshContextWrapper>
              <div className="flex">
                <SideNavBar />
                <div className="grid grid-cols-1 md:grid-cols-3 w-full">
                  <div className="col-span-2">{children}</div>
                  <div>Storage</div>
                </div>
              </div>
              </FileRefreshContextWrapper>
            </FolderRefreshContextWrapper>
          </ParentFolderIdContextWrapper>
        </SessionWrapper>
      </body>
    </html>
  );
}
