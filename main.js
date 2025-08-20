async function recognize(base64, lang, options) {
    const { config, utils } = options;
    const { http, readBinaryFile } = utils;
    const { fetch, Body } = http;

    const apiUrl = 'https://server.simpletex.cn/api/simpletex_ocr';

    const apiKey = config.apikey;
    if (!apiKey) {
        throw new Error('API Key is required');
    }

    // Use cached image and convert them into binary, referring to the official documentation for implementation.
    let file = await readBinaryFile('pot_screenshot_cut.png', { dir: BaseDirectory.AppCache });
    
    //****************************************************
    //** Converting with base64 into binary also works. **
    //****************************************************
    // const binaryData = atob(base64);
    // const bytes = new Uint8Array(binaryData.length);
    // for (let i = 0; i < binaryData.length; i++) {
    //   bytes[i] = binaryData.charCodeAt(i);
    // }

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              token: apiKey,
              'content-type': 'multipart/form-data',
            },
            body: Body.form({
              file: {
                // Use cached image
                file: file,
                // Use base64 to binary
                // file: bytes,
                fileName: 'pot_screenshot_cut.png',
              },
              // rec_mode: 'document',
            })
        });

        if (response.ok) {
          let result = response.data;
          if (result.status && result.res) {
            if (result.res.type === 'formula') {
              return result.res.info;
            } else {
              return result.res.info.markdown;
            }
          } else {
            throw JSON.stringify(result);
          }
        } else {
          throw `Http Request Error\nHttp Status: ${res.status}\n${JSON.stringify(res.data)}`;
        }

    } catch (error) {
        throw error;
    }
}
