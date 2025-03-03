const express = require('express');
const app = express();
const port = 3000;
const B2 = require('backblaze-b2');
require('dotenv').config();

// Initialize the Backblaze B2 client
const b2 = new B2({
  applicationKeyId: process.env.APP_KEY_ID, // Replace with your B2 Application Key ID
  applicationKey: process.env.APP_KEY, // Replace with your B2 Application Key
});

// Set your bucket name and the file name variable
const bucketName = process.env.BUCKET_NAME;
let fileName = process.env.FILE_NAME; // You can change this variable as needed

const authenticateB2 = async () => {
  try {
    await b2.authorize();  // Must authorize before making requests
    console.log('Authenticated with Backblaze B2');
  } catch (err) {
    console.error('Error authenticating with Backblaze B2:', err);
    throw err;
  }
};

// Stream the file directly to the client
const downloadFileFromB2 = async (fileName, res) => {
  try {
    // Authenticate before making requests
    await authenticateB2();

    // Download the file by name
    const downloadResponse = await b2.downloadFileByName({
      bucketName,
      fileName,
      responseType: 'stream',  // We need the file as a stream to pipe it to the response
    });

    const fileStream = downloadResponse.data;

    // Set headers to indicate the content type and force download
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'application/pdf');

    // Pipe the file stream to the response (this will close the response once done)
    fileStream.pipe(res);
  } catch (err) {
    console.error('Download failed:', err);
    res.status(500).send('Failed to download the file');
  }
};

// Single route to trigger the download and close the window
app.get('/', async (req, res) => {
  await downloadFileFromB2(fileName, res);  // This will trigger the file download
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
