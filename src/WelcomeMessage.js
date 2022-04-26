import React from 'react';
import { Alert, Box, BaseTemplate, Button, PageHead, ThemeProvider } from '@myob/myob-widgets';

const WelcomeMessage = () => {
  const helpOnClick = () => {
    window.open("https://myob.slack.com/archives/C0521TK7H",'_blank');
  }

  const secondaryMessage = (
    <Box display="flex">
      <Box as="p" marginTop="auto" marginBottom="auto" marginRight="md">
        Remember, if you ever need a hand, help if just a click away!
      </Box>
      <Button onClick={helpOnClick} tone="brand">I need help! 🙋</Button>
    </Box>
  )

  return (
    <ThemeProvider theme="modern">
      <BaseTemplate>
        <PageHead title="Welcome to your Feelix template repo! 👋" />
        <Alert type="info" secondaryMessage={secondaryMessage} secondaryMessageVisible>
          We can't wait for you to get started. <a href="https://feelix.myob.com/" target="_blank" rel="noreferrer">Here's a handy link</a> to our docs.
        </Alert>
        <Alert type="info">
          Oh, and if you're wondering... This template app was made using Create-react-app.
        </Alert>
      </BaseTemplate>
    </ThemeProvider>
  );
};

export default WelcomeMessage;
