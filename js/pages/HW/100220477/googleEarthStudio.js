const HW100220477_googleEarthStudio = {
    setup() {
    },
    template: /* html */ `
        <div class="flex flex-col items-center w-full p-4 gap-4">
            <h2 class="text-2xl font-bold">Google Earth Studio 影片展示</h2>
            
            <div class="w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden shadow-xl relative">
                <iframe 
                    width="100%" 
                    height="100%" 
                    src="https://www.youtube.com/embed/jpdJiu8Ub4M?si=8vRTDypggC8Plmun" 
                    title="YouTube video player" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerpolicy="strict-origin-when-cross-origin" 
                    allowfullscreen
                ></iframe>
            </div>

            <p class="mt-2">
                這是使用 Google Earth Studio 製作的地球縮時攝影/運鏡影片。
            </p>
        </div>
    `,
};

export default HW100220477_googleEarthStudio;
