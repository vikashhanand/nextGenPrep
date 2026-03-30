import './globals.css';
import { AuthProvider } from './components/AuthProvider';
import LayoutWrapper from './components/LayoutWrapper';

export const metadata = {
  title: 'nextGenPrep',
  description: 'The ultimate free study companion for every aspirant. Master your exams with AI.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        <AuthProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
