const Footer = {
    props: ['currentTheme', 'i18n'],
    template: `
        <footer class="p-6">
            <ul class="flex flex-wrap justify-center gap-5">
                <li>
                    <a href="https://github.com/aac219oo" target="_blank" class="block"
                        ><img
                            src="./assets/images/github-brands.svg"
                            alt="github"
                            title="github page"
                    /></a>
                </li>
                <li>
                    <a
                        href="https://www.instagram.com/aac219oo?utm_source=qr"
                        target="_blank"
                        class="block"
                        ><img
                            src="./assets/images/instagram.svg"
                            alt="instagram"
                            title="instagram page"
                    /></a>
                </li>
                <li>
                    <a
                        href="https://linevoom.line.me/user/_de9WAjpSg2-1sSHf2bVtXTMnX6z4t05IrLZWDO0?utm_medium=windows&utm_source=desktop&utm_campaign=Profile"
                        target="_blank"
                        class="block"
                        ><img src="./assets/images/line.svg" alt="line" title="line"
                    /></a>
                </li>
            </ul>
        </footer>
    `,
};

export default Footer;
