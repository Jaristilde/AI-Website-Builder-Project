import React from 'react';
import { useSearchParams } from 'react-router-dom';
import WizardShell from '../components/wizard/WizardShell';

const WizardPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const autoShowImport = searchParams.get('mode') === 'import';

  return <WizardShell autoShowImport={autoShowImport} />;
};

export default WizardPage;
