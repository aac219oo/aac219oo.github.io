const HW100219359 = {
    data() {
        return {
            currentAuthor: {
                name: 'Leongsan',
                authorUrl:
                    'https://unsplash.com/@leongsan?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText',
                photoUrl:
                    'https://unsplash.com/photos/people-waiting-on-a-train-platform-d2aCbaPymVU?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText',
                model: '電腦',
            },
            photoSource: 'Unsplash',
        };
    },
    mounted() {
        const desktop = window.matchMedia('(min-width: 1200px)');
        const mobile = window.matchMedia('(max-width: 540px)');

        const updateAuthor = () => {
            if (mobile.matches) {
                this.currentAuthor = {
                    name: 'Junel Mujar',
                    authorUrl:
                        'https://unsplash.com/@junelmujar?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText',
                    photoUrl:
                        'https://unsplash.com/photos/sandy-dunes-with-misty-ocean-and-distant-hills-3fKdRnTBYkw?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText',
                    model: '手機直式',
                };
            } else if (desktop.matches) {
                this.currentAuthor = {
                    name: 'Leongsan',
                    authorUrl:
                        'https://unsplash.com/@leongsan?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText',
                    photoUrl:
                        'https://unsplash.com/photos/people-waiting-on-a-train-platform-d2aCbaPymVU?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText',
                    model: '電腦',
                };
            } else {
                this.currentAuthor = {
                    name: 'Zach Miller',
                    authorUrl:
                        'https://unsplash.com/@zvchmiller?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText',
                    photoUrl:
                        'https://unsplash.com/photos/person-in-pig-mask-and-overalls-on-train-EdGIQOgIKjI?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText',
                    model: '手機橫式',
                };
            }
        };

        updateAuthor();
        desktop.addEventListener('change', updateAuthor);
        mobile.addEventListener('change', updateAuthor);
    },
    template: `
        <section>
            <p>現在是【{{ currentAuthor.model }}】模式<p>
            <picture>
                <source
                    media="(min-width: 1200px)"
                    srcset="/assets/images/100219359/leongsan-d2aCbaPymVU-unsplash.jpg"
                />
                <source
                    media="(max-width: 540px)"
                    srcset="/assets/images/100219359/junel-mujar-3fKdRnTBYkw-unsplash.jpg"
                />
                <img
                    src="/assets/images/100219359/zach-miller-EdGIQOgIKjI-unsplash.jpg"
                    :alt="'Photo by ' + currentAuthor.name + ' on ' + photoSource"
                />
            </picture>
            <p>
                Photo by 
                <a :href="currentAuthor.authorUrl">{{ currentAuthor.name }}</a> 
                on 
                <a :href="currentAuthor.photoUrl">{{ photoSource }}</a>
            </p>
        </section>
    `,
};

export default HW100219359;
