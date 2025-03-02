const fs = require('fs');
const axios = require('axios');
const express = require('express')
const app = express()
const port = 3000

const downloadFile = async (url, dest) => {
	    const writer = fs.createWriteStream(dest);
	    const response = await axios({
		            url,
		            method: 'GET',
		            responseType: 'stream',
		        });

	    response.data.pipe(writer);

	    return new Promise((resolve, reject) => {
		            writer.on('finish', resolve);
		            writer.on('error', reject);
		        });
};

const fileUrl = 'https://eaesp.fgv.br/sites/eaesp.fgv.br/files/pesti2019fgvciappt_2019.pdf';
const destination = 'pesti2019fgvciappt_2019.pdf';



app.get('/', (req, res) => {

  
downloadFile(fileUrl, destination)
.then(() => {
			console.log('File downloaded successfully to', destination);
		})
.catch(err => {
			console.error('Download failed:', err);
		});
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})