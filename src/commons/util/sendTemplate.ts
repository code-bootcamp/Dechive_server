export const dechiveTemplate = (authNumber: string) => {
  return `
    <html>
        <body>
            <div style="display: flex; flex-direction: column; align-items: center;">
                <div style="width: 500px;">
                    <h1>Dechive에서 전송한 인증번호입니다.</h1>
                    <hr />
                    <div style="color: black;">인증번호는 ${authNumber} 입니다.</div>
                </div>
            </div>
        </body>
    </html>
  `;
};

export const RanmomNumber = () => {
  return String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
};
