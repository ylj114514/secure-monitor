import type { ReactNode } from "react";
import NotificationPanel from "./NotificationPanel";
import SideDock from "./SideDock";
import TopStatusBar from "./TopStatusBar";
import WindowFrame from "./WindowFrame";

type Props = {
  activePage: string;
  setActivePage: (page: string) => void;
  pageTitle: string;
  overview: any;
  alerts: any[];
  children: ReactNode;
};

export default function DesktopLayout({
  activePage,
  setActivePage,
  pageTitle,
  overview,
  alerts,
  children
}: Props) {
  return (
    <div className="desktop-shell">
      <TopStatusBar overview={overview} />
      <div className="desktop-body">
        <SideDock activePage={activePage} setActivePage={setActivePage} />
        <main className="desktop-main">
          <WindowFrame title={pageTitle}>{children}</WindowFrame>
        </main>
        <NotificationPanel alerts={alerts} overview={overview} />
      </div>
    </div>
  );
}
