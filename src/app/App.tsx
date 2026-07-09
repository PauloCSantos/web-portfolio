import { AppProviders } from "./providers/AppProviders";
import { MainLayout } from "./layouts/MainLayout";
import { IntroAppSection } from "@widgets/shell";
import { HomePage } from "@pages/home";
import { APP_PROFILE } from "./config/profile";

export default function App() {
  return (
    <AppProviders>
      <MainLayout Shell={IntroAppSection}>
        <HomePage links={APP_PROFILE.social} />
      </MainLayout>
    </AppProviders>
  );
}
