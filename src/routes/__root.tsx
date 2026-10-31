import type {ReactNode} from "react";
import {HeadContent, Outlet, Scripts, createRootRoute} from "@tanstack/react-router";
import {Toaster} from "@/components/ui/toaster";
import {Toaster as Sonner} from "@/components/ui/sonner";
import {TooltipProvider} from "@/components/ui/tooltip";
import {PLATFORM_META, PLATFORM_SCRIPTS} from "@/platform/scripts.gen";
import {HMR_CLIENT} from "@/platform/dev-hmr";
import MetrikaTracker from "@/components/MetrikaTracker";
import PrivacyDialog from "@/components/legal/PrivacyDialog";
import NotFound from "@/pages/NotFound";
import appCss from "@/index.css?url";

const TITLE = "ProfilDoors в МЦ Roomer — официальный салон дверей, м. Автозаводская";
const OG_TITLE = "ProfilDoors в МЦ Roomer — Официальный салон";
const DESCRIPTION =
    "Премиальные двери Invisible, шпон, эмаль и новая коллекция Orange 2026. Флагманский шоурум ProfilDoors в Москве, МЦ Roomer.";
const OG_IMAGE = "https://profildoors-roomer.ru/og-image.jpg";
const FONTS = "https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&subset=cyrillic,latin&display=swap";

const JSON_LD = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: "ProfilDoors в МЦ Roomer — официальный салон",
    url: "https://profildoors-roomer.ru/",
    image: "https://profildoors-roomer.ru/og-image.jpg",
    telephone: "+7 901 592-72-24",
    priceRange: "₽₽₽",
    address: {
        "@type": "PostalAddress",
        streetAddress: "ул. Ленинская Слобода, 26, МЦ Roomer, этаж 1, павильон А149–А151",
        addressLocality: "Москва",
        addressCountry: "RU",
    },
    geo: {"@type": "GeoCoordinates", latitude: 55.712613, longitude: 37.653495},
    openingHoursSpecification: [
        {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            opens: "10:00",
            closes: "22:00",
        },
    ],
    sameAs: ["https://vk.com/profildoors__design"],
};

const METRIKA = `window.dataLayer = window.dataLayer || [];
(function(m,e,t,r,i,k,a){
    m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1*new Date();
    for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
    k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
})(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=113657043', 'ym');
ym(113657043, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});`;

export const Route = createRootRoute({
    head: () => ({
        meta: [
            {charSet: "utf-8"},
            {name: "viewport", content: "width=device-width, initial-scale=1.0"},
            {title: TITLE},
            {name: "description", content: DESCRIPTION},
            {name: "theme-color", content: "#0B0C0E"},
            {name: "robots", content: "index, follow"},
            {name: "author", content: "ProfilDoors в МЦ Roomer"},
            {property: "og:title", content: OG_TITLE},
            {property: "og:description", content: DESCRIPTION},
            {property: "og:type", content: "website"},
            {property: "og:url", content: "https://profildoors-roomer.ru/"},
            {property: "og:site_name", content: "ProfilDoors в МЦ Roomer"},
            {property: "og:locale", content: "ru_RU"},
            {property: "og:image", content: OG_IMAGE},
            {property: "og:image:secure_url", content: OG_IMAGE},
            {property: "og:image:type", content: "image/jpeg"},
            {property: "og:image:width", content: "1200"},
            {property: "og:image:height", content: "630"},
            {property: "og:image:alt", content: "ProfilDoors в МЦ Roomer — официальный салон дверей"},
            {property: "vk:image", content: OG_IMAGE},
            {name: "twitter:card", content: "summary_large_image"},
            {name: "twitter:title", content: OG_TITLE},
            {name: "twitter:description", content: DESCRIPTION},
            {name: "twitter:image", content: OG_IMAGE},
            ...PLATFORM_META,
        ],
        links: [
            {rel: "preconnect", href: "https://fonts.googleapis.com"},
            {rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous"},
            {rel: "preload", as: "style", href: FONTS},
            {rel: "stylesheet", href: FONTS},
            {rel: "stylesheet", href: appCss},
            {rel: "icon", type: "image/svg+xml", href: "/favicon.svg"},
            {rel: "apple-touch-icon", href: "/apple-touch-icon.png"},
        ],
        // IMPORTANT: DO NOT REMOVE PLATFORM SCRIPTS AND THE DEV HMR CLIENT!
        scripts: [
            ...(import.meta.env.DEV ? [{children: HMR_CLIENT}] : []),
            ...PLATFORM_SCRIPTS,
            {type: "application/ld+json", children: JSON.stringify(JSON_LD)},
            {children: METRIKA},
        ],
    }),
    component: RootComponent,
    notFoundComponent: NotFound,
});

function RootComponent() {
    return (
        <RootDocument>
            <TooltipProvider>
                <Toaster/>
                <Sonner/>
                <MetrikaTracker/>
                <PrivacyDialog/>
                <Outlet/>
            </TooltipProvider>
        </RootDocument>
    );
}

function RootDocument({children}: { children: ReactNode }) {
    return (
        <html lang="ru">
        <head>
            <HeadContent/>
        </head>
        <body>
        {children}
        <Scripts/>
        </body>
        </html>
    );
}
