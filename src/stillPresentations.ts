import {
  resolveStoryFrameLayout,
  validateStoryStillExternalLayout,
  type StoryFrameLayout,
  type StoryStillTween,
  type StoryStillPresentation,
  type StoryStillPresentationProvider,
} from "@haneoka/vega/renderer-kit";

const presentations: Readonly<Record<string, StoryStillPresentation>> = {
  adv_still_anime_000001: {
    layout: {
      referenceWidth: 1920,
      nodes: [
        {
          id: "3154127347367113048",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [0.0, 0.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
        },
        {
          id: "8961594928484807000",
          parent: "3154127347367113048",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [0.0, 0.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1.0,
          active: true,
        },
        {
          id: "7240763560386654552",
          parent: "8961594928484807000",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [1920.0, 1920.0],
          scale: [2.0, 2.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
          image: {
            color: [0.0, 0.0, 0.0, 1.0],
            blend: "normal",
            preserveAspect: false,
          },
        },
        {
          id: "-6303962840822615720",
          parent: "8961594928484807000",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [1920.0, 1080.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
          image: {
            color: [1.0, 1.0, 1.0, 1.0],
            blend: "normal",
            preserveAspect: false,
            textureKey: "still",
          },
        },
      ],
    },
    sequences: [],
  },
  adv_still_anime_000002: {
    layout: {
      referenceWidth: 1920,
      nodes: [
        {
          id: "7626495364350577435",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [0.0, 0.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
        },
        {
          id: "-8429809950902875365",
          parent: "7626495364350577435",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [0.0, 0.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1.0,
          active: true,
        },
        {
          id: "-3462052199861089509",
          parent: "-8429809950902875365",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [1920.0, 1920.0],
          scale: [2.0, 2.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
          image: {
            color: [0.0, 0.0, 0.0, 1.0],
            blend: "normal",
            preserveAspect: false,
          },
        },
        {
          id: "2333370103830186779",
          parent: "-8429809950902875365",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [1920.0, 1080.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
          image: {
            color: [1.0, 1.0, 1.0, 1.0],
            blend: "normal",
            preserveAspect: false,
            textureKey: "still",
          },
        },
      ],
    },
    sequences: [],
  },
  adv_still_anime_000003: {
    layout: {
      referenceWidth: 1920,
      nodes: [
        {
          id: "-8102619647052028150",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [0.0, 0.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
        },
        {
          id: "-4970613918497773814",
          parent: "-8102619647052028150",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [0.0, 0.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1.0,
          active: true,
        },
        {
          id: "-6694440474145396982",
          parent: "-4970613918497773814",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [1920.0, 1920.0],
          scale: [2.0, 2.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
          image: {
            color: [0.0, 0.0, 0.0, 1.0],
            blend: "normal",
            preserveAspect: false,
          },
        },
        {
          id: "7898911851598112522",
          parent: "-4970613918497773814",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [1920.0, 1080.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
          image: {
            color: [1.0, 1.0, 1.0, 1.0],
            blend: "normal",
            preserveAspect: false,
            textureKey: "still",
          },
        },
      ],
    },
    sequences: [],
  },
  adv_still_anime_000004: {
    layout: {
      referenceWidth: 1920,
      nodes: [
        {
          id: "9116153231309399171",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [0.0, 0.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
        },
        {
          id: "8681629460914693251",
          parent: "9116153231309399171",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [0.0, 0.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1.0,
          active: true,
        },
        {
          id: "619956648290215043",
          parent: "8681629460914693251",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [1920.0, 1920.0],
          scale: [2.0, 2.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
          image: {
            color: [0.0, 0.0, 0.0, 1.0],
            blend: "normal",
            preserveAspect: false,
          },
        },
        {
          id: "7131438651026826371",
          parent: "8681629460914693251",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [1920.0, 1080.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
          image: {
            color: [1.0, 1.0, 1.0, 1.0],
            blend: "normal",
            preserveAspect: false,
            textureKey: "still",
          },
        },
      ],
    },
    sequences: [],
  },
  adv_still_anime_000005: {
    layout: {
      referenceWidth: 1920,
      nodes: [
        {
          id: "-6207220808445942487",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [0.0, 0.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
        },
        {
          id: "3591138435938100521",
          parent: "-6207220808445942487",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [0.0, 0.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1.0,
          active: true,
        },
        {
          id: "-4298345905467841239",
          parent: "3591138435938100521",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [1920.0, 1920.0],
          scale: [2.0, 2.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
          image: {
            color: [0.0, 0.0, 0.0, 1.0],
            blend: "normal",
            preserveAspect: false,
          },
        },
        {
          id: "5848376124728255785",
          parent: "3591138435938100521",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [1920.0, 1080.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
          image: {
            color: [1.0, 1.0, 1.0, 1.0],
            blend: "normal",
            preserveAspect: false,
            textureKey: "still",
          },
        },
      ],
    },
    sequences: [],
  },
  adv_still_anime_000006: {
    layout: {
      referenceWidth: 1920,
      nodes: [
        {
          id: "8038382085715220136",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [0.0, 0.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
        },
        {
          id: "-220881461379311960",
          parent: "8038382085715220136",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [0.0, 0.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1.0,
          active: true,
        },
        {
          id: "-899552334966597976",
          parent: "-220881461379311960",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [1920.0, 1920.0],
          scale: [2.0, 2.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
          image: {
            color: [0.0, 0.0, 0.0, 1.0],
            blend: "normal",
            preserveAspect: false,
          },
        },
        {
          id: "-4640600009881332056",
          parent: "-220881461379311960",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [1920.0, 1080.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
          image: {
            color: [1.0, 1.0, 1.0, 1.0],
            blend: "normal",
            preserveAspect: false,
            textureKey: "still",
          },
        },
      ],
    },
    sequences: [],
  },
  adv_still_anime_000007: {
    layout: {
      referenceWidth: 1920,
      nodes: [
        {
          id: "6970090589749762215",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [0.0, 0.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
        },
        {
          id: "4303717828782184615",
          parent: "6970090589749762215",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [0.0, 0.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1.0,
          active: true,
        },
        {
          id: "-366565642383468377",
          parent: "4303717828782184615",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [1920.0, 1920.0],
          scale: [2.0, 2.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
          image: {
            color: [0.0, 0.0, 0.0, 1.0],
            blend: "normal",
            preserveAspect: false,
          },
        },
        {
          id: "6447173703898159271",
          parent: "4303717828782184615",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [1920.0, 1080.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
          image: {
            color: [1.0, 1.0, 1.0, 1.0],
            blend: "normal",
            preserveAspect: false,
            textureKey: "still",
          },
        },
      ],
    },
    sequences: [],
  },
  adv_still_anime_000008: {
    layout: {
      referenceWidth: 1920,
      nodes: [
        {
          id: "1695609738850285072",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [0.0, 0.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
        },
        {
          id: "-1185332072372488688",
          parent: "1695609738850285072",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [0.0, 0.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1.0,
          active: true,
        },
        {
          id: "4865923444134589968",
          parent: "-1185332072372488688",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [1920.0, 1920.0],
          scale: [2.0, 2.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
          image: {
            color: [0.0, 0.0, 0.0, 1.0],
            blend: "normal",
            preserveAspect: false,
          },
        },
        {
          id: "-6728031791385790960",
          parent: "-1185332072372488688",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [1920.0, 1080.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
          image: {
            color: [1.0, 1.0, 1.0, 1.0],
            blend: "normal",
            preserveAspect: false,
            textureKey: "still",
          },
        },
      ],
    },
    sequences: [],
  },
  adv_still_anime_000019: {
    layout: {
      referenceWidth: 1920,
      nodes: [
        {
          id: "8356408613874466383",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [0.0, 0.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
        },
        {
          id: "-1970491081505538481",
          parent: "8356408613874466383",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [0.0, 0.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1.0,
          active: true,
        },
        {
          id: "8086430522489011791",
          parent: "-1970491081505538481",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [1920.0, 1920.0],
          scale: [2.0, 2.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
          image: {
            color: [0.0, 0.0, 0.0, 1.0],
            blend: "normal",
            preserveAspect: false,
          },
        },
        {
          id: "-7792151547472019889",
          parent: "-1970491081505538481",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [1920.0, 1080.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
          image: {
            color: [1.0, 1.0, 1.0, 1.0],
            blend: "normal",
            preserveAspect: false,
            textureKey: "still",
          },
        },
      ],
    },
    sequences: [],
  },
  adv_still_anime_000020: {
    layout: {
      referenceWidth: 1920,
      nodes: [
        {
          id: "-1487620302196592725",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [0.0, 0.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
        },
        {
          id: "-5236031037829632085",
          parent: "-1487620302196592725",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [0.0, 0.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1.0,
          active: true,
        },
        {
          id: "-980308149900103765",
          parent: "-5236031037829632085",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [1920.0, 1920.0],
          scale: [2.0, 2.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
          image: {
            color: [0.0, 0.0, 0.0, 1.0],
            blend: "normal",
            preserveAspect: false,
          },
        },
        {
          id: "-2163896809491026005",
          parent: "-5236031037829632085",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [1920.0, 1080.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
          image: {
            color: [1.0, 1.0, 1.0, 1.0],
            blend: "normal",
            preserveAspect: false,
            textureKey: "still",
          },
        },
      ],
    },
    sequences: [
      {
        id: "0",
        duration: 0.0,
        loop: false,
        tweens: [],
      },
      {
        id: "1",
        duration: 5.0,
        loop: false,
        tweens: [
          {
            node: "-5236031037829632085",
            property: "scale",
            at: 0.0,
            duration: 0.0,
            ease: 6,
            value: [1.7000000476837158, 1.7000000476837158],
          },
          {
            node: "-5236031037829632085",
            property: "position",
            at: 0.0,
            duration: 0.0,
            ease: 6,
            value: [0.0, 50.0],
          },
          {
            node: "-5236031037829632085",
            property: "position",
            at: 0.0,
            duration: 1.5,
            ease: 6,
            value: [0.0, -50.0],
          },
        ],
      },
      {
        id: "2",
        duration: 1.0,
        loop: false,
        tweens: [
          {
            node: "-5236031037829632085",
            property: "scale",
            at: 0.0,
            duration: 0.5,
            ease: 15,
            value: [1.5, 1.5],
          },
        ],
      },
    ],
  },
  adv_still_anime_000069: {
    layout: {
      referenceWidth: 1920,
      nodes: [
        {
          id: "7958012090720632226",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [0.0, 0.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
        },
        {
          id: "6971547227174714786",
          parent: "7958012090720632226",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [0.0, 0.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1.0,
          active: true,
        },
        {
          id: "5747411165732388258",
          parent: "6971547227174714786",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [1920.0, 1920.0],
          scale: [2.0, 2.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
          image: {
            color: [0.0, 0.0, 0.0, 1.0],
            blend: "normal",
            preserveAspect: false,
          },
        },
        {
          id: "-7986404075493212766",
          parent: "6971547227174714786",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [1920.0, 1080.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
          image: {
            color: [1.0, 1.0, 1.0, 1.0],
            blend: "normal",
            preserveAspect: false,
            textureKey: "still",
          },
        },
      ],
    },
    sequences: [],
  },
  adv_still_anime_000070: {
    layout: {
      referenceWidth: 1920,
      nodes: [
        {
          id: "-4255072113804232309",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [0.0, 0.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
        },
        {
          id: "4284399476794734987",
          parent: "-4255072113804232309",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [0.0, 0.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1.0,
          active: true,
        },
        {
          id: "-2778389539921053301",
          parent: "4284399476794734987",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [1920.0, 1920.0],
          scale: [2.0, 2.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
          image: {
            color: [0.0, 0.0, 0.0, 1.0],
            blend: "normal",
            preserveAspect: false,
          },
        },
        {
          id: "4827970547761822091",
          parent: "4284399476794734987",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [1920.0, 1080.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
          image: {
            color: [1.0, 1.0, 1.0, 1.0],
            blend: "normal",
            preserveAspect: false,
            textureKey: "still",
          },
        },
      ],
    },
    sequences: [
      {
        id: "0",
        duration: 0.0,
        loop: false,
        tweens: [],
      },
      {
        id: "1",
        duration: 0.0,
        loop: false,
        tweens: [
          {
            node: "4284399476794734987",
            property: "position",
            at: 0.0,
            duration: 0.0,
            ease: 1,
            value: [1400.0, -100.0],
          },
          {
            node: "4284399476794734987",
            property: "scale",
            at: 0.0,
            duration: 0.0,
            ease: 6,
            value: [5.0, 5.0],
          },
        ],
      },
    ],
  },
  adv_still_anime_000071: {
    layout: {
      referenceWidth: 1920,
      nodes: [
        {
          id: "-1745693146788521167",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [0.0, 0.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
        },
        {
          id: "-8869066723512870095",
          parent: "-1745693146788521167",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [0.0, 0.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1.0,
          active: true,
        },
        {
          id: "-7378830173994017999",
          parent: "-8869066723512870095",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [1920.0, 1920.0],
          scale: [2.0, 2.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
          image: {
            color: [0.0, 0.0, 0.0, 1.0],
            blend: "normal",
            preserveAspect: false,
          },
        },
        {
          id: "-5094847040750740687",
          parent: "-8869066723512870095",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [1920.0, 1080.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
          image: {
            color: [1.0, 1.0, 1.0, 1.0],
            blend: "normal",
            preserveAspect: false,
            textureKey: "still",
          },
        },
      ],
    },
    sequences: [],
  },
  adv_still_anime_000072: {
    layout: {
      referenceWidth: 1920,
      nodes: [
        {
          id: "6089832227822884376",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [0.0, 0.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
        },
        {
          id: "-1495658484864461288",
          parent: "6089832227822884376",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [0.0, 0.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1.0,
          active: true,
        },
        {
          id: "-7214426244909181416",
          parent: "-1495658484864461288",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [1920.0, 1920.0],
          scale: [2.0, 2.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
          image: {
            color: [0.0, 0.0, 0.0, 1.0],
            blend: "normal",
            preserveAspect: false,
          },
        },
        {
          id: "4433414350592267800",
          parent: "-1495658484864461288",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [1920.0, 1080.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
          image: {
            color: [1.0, 1.0, 1.0, 1.0],
            blend: "normal",
            preserveAspect: false,
            textureKey: "still",
          },
        },
      ],
    },
    sequences: [
      {
        id: "0",
        duration: 0.0,
        loop: false,
        tweens: [],
      },
      {
        id: "1",
        duration: 0.0,
        loop: false,
        tweens: [
          {
            node: "-1495658484864461288",
            property: "scale",
            at: 0.0,
            duration: 0.0,
            ease: 6,
            value: [1.5, 1.5],
          },
          {
            node: "-1495658484864461288",
            property: "position",
            at: 0.0,
            duration: 0.0,
            ease: 6,
            value: [-300.0, -200.0],
          },
        ],
      },
      {
        id: "2",
        duration: 1.0,
        loop: false,
        tweens: [
          {
            node: "-1495658484864461288",
            property: "position",
            at: 0.0,
            duration: 1.0,
            ease: 1,
            value: [225.0, -200.0],
          },
        ],
      },
      {
        id: "3",
        duration: 1.0,
        loop: false,
        tweens: [
          {
            node: "-1495658484864461288",
            property: "position",
            at: 0.0,
            duration: 1.0,
            ease: 1,
            value: [-300.0, -200.0],
          },
        ],
      },
    ],
  },
  adv_still_anime_000073: {
    layout: {
      referenceWidth: 1920,
      nodes: [
        {
          id: "4273030021713255549",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [0.0, 0.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
        },
        {
          id: "6548214537030687869",
          parent: "4273030021713255549",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [0.0, 0.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1.0,
          active: true,
        },
        {
          id: "-3294686078473511811",
          parent: "6548214537030687869",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [1920.0, 1920.0],
          scale: [2.0, 2.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
          image: {
            color: [0.0, 0.0, 0.0, 1.0],
            blend: "normal",
            preserveAspect: false,
          },
        },
        {
          id: "3981615114144406653",
          parent: "6548214537030687869",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [1920.0, 1080.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
          image: {
            color: [1.0, 1.0, 1.0, 1.0],
            blend: "normal",
            preserveAspect: false,
            textureKey: "still",
          },
        },
      ],
    },
    sequences: [],
  },
  adv_still_anime_000074: {
    layout: {
      referenceWidth: 1920,
      nodes: [
        {
          id: "-1606708431658187276",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [0.0, 0.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
        },
        {
          id: "-6171842576774560268",
          parent: "-1606708431658187276",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [0.0, 0.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1.0,
          active: true,
        },
        {
          id: "5542874732546524660",
          parent: "-6171842576774560268",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [1920.0, 1920.0],
          scale: [2.0, 2.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
          image: {
            color: [0.0, 0.0, 0.0, 1.0],
            blend: "normal",
            preserveAspect: false,
          },
        },
        {
          id: "4188583622130238964",
          parent: "-6171842576774560268",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [1920.0, 1080.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
          image: {
            color: [1.0, 1.0, 1.0, 1.0],
            blend: "normal",
            preserveAspect: false,
            textureKey: "still",
          },
        },
      ],
    },
    sequences: [],
  },
  adv_still_anime_000075: {
    layout: {
      referenceWidth: 1920,
      nodes: [
        {
          id: "6476479321284518249",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [0.0, 0.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
        },
        {
          id: "-1734879565195533975",
          parent: "6476479321284518249",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [0.0, 0.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1.0,
          active: true,
        },
        {
          id: "-6469115863128694423",
          parent: "-1734879565195533975",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [1920.0, 1920.0],
          scale: [2.0, 2.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
          image: {
            color: [0.0, 0.0, 0.0, 1.0],
            blend: "normal",
            preserveAspect: false,
          },
        },
        {
          id: "-5511313512640568983",
          parent: "-1734879565195533975",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [1920.0, 1080.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
          image: {
            color: [1.0, 1.0, 1.0, 1.0],
            blend: "normal",
            preserveAspect: false,
            textureKey: "still",
          },
        },
      ],
    },
    sequences: [
      {
        id: "0",
        duration: 0.0,
        loop: false,
        tweens: [],
      },
      {
        id: "1",
        duration: 0.0,
        loop: false,
        tweens: [
          {
            node: "-1734879565195533975",
            property: "scale",
            at: 0.0,
            duration: 0.0,
            ease: 6,
            value: [1.5, 1.5],
          },
        ],
      },
    ],
  },
  adv_still_anime_000076: {
    layout: {
      referenceWidth: 1920,
      nodes: [
        {
          id: "4167307437505785951",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [0.0, 0.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
        },
        {
          id: "3718552354876239967",
          parent: "4167307437505785951",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [0.0, 0.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1.0,
          active: true,
        },
        {
          id: "-6091991113741750177",
          parent: "3718552354876239967",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [1920.0, 1920.0],
          scale: [2.0, 2.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
          image: {
            color: [0.0, 0.0, 0.0, 1.0],
            blend: "normal",
            preserveAspect: false,
          },
        },
        {
          id: "4075731254413635679",
          parent: "3718552354876239967",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [1920.0, 1080.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
          image: {
            color: [1.0, 1.0, 1.0, 1.0],
            blend: "normal",
            preserveAspect: false,
            textureKey: "still",
          },
        },
      ],
    },
    sequences: [],
  },
  adv_still_anime_000077: {
    layout: {
      referenceWidth: 1920,
      nodes: [
        {
          id: "7776794067494775062",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [0.0, 0.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
        },
        {
          id: "-8684790214412785386",
          parent: "7776794067494775062",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [0.0, 0.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1.0,
          active: true,
        },
        {
          id: "3407343715316279574",
          parent: "-8684790214412785386",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [9600.0, 5760.0],
          scale: [2.0, 2.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
          image: {
            color: [0.0, 0.0, 0.0, 1.0],
            blend: "normal",
            preserveAspect: false,
          },
        },
        {
          id: "4584887276978514198",
          parent: "-8684790214412785386",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [1920.0, 1080.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
          image: {
            color: [1.0, 1.0, 1.0, 1.0],
            blend: "normal",
            preserveAspect: false,
            textureKey: "still",
          },
        },
      ],
    },
    sequences: [
      {
        id: "0",
        duration: 0.0,
        loop: false,
        tweens: [],
      },
      {
        id: "1",
        duration: 0.0,
        loop: false,
        tweens: [
          {
            node: "-8684790214412785386",
            property: "scale",
            at: 0.0,
            duration: 0.0,
            ease: 6,
            value: [1.0, 1.0],
          },
        ],
      },
    ],
  },
  adv_still_anime_000078: {
    layout: {
      referenceWidth: 1920,
      nodes: [
        {
          id: "3339321592365718478",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [0.0, 0.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
        },
        {
          id: "5116472251531598798",
          parent: "3339321592365718478",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [0.0, 0.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1.0,
          active: true,
        },
        {
          id: "4629645565986937806",
          parent: "5116472251531598798",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [1920.0, 1920.0],
          scale: [2.0, 2.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
          image: {
            color: [0.0, 0.0, 0.0, 1.0],
            blend: "normal",
            preserveAspect: false,
          },
        },
        {
          id: "-9129992392531502130",
          parent: "5116472251531598798",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [1920.0, 1080.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
          image: {
            color: [1.0, 1.0, 1.0, 1.0],
            blend: "normal",
            preserveAspect: false,
            textureKey: "still",
          },
        },
      ],
    },
    sequences: [
      {
        id: "0",
        duration: 0.0,
        loop: false,
        tweens: [],
      },
      {
        id: "1",
        duration: 0.0,
        loop: false,
        tweens: [
          {
            node: "5116472251531598798",
            property: "rotation",
            at: 0.0,
            duration: 0.0,
            ease: 6,
            value: [-0.08726646259971647],
          },
        ],
      },
      {
        id: "2",
        duration: 0.0,
        loop: false,
        tweens: [
          {
            node: "5116472251531598798",
            property: "rotation",
            at: 0.0,
            duration: 0.0,
            ease: 6,
            value: [-0.17453292519943295],
          },
        ],
      },
    ],
  },
  adv_still_anime_000079: {
    layout: {
      referenceWidth: 1920,
      nodes: [
        {
          id: "7439556353192147384",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [0.0, 0.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
        },
        {
          id: "-8733694041155323464",
          parent: "7439556353192147384",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [0.0, 0.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1.0,
          active: true,
        },
        {
          id: "1100913128043493816",
          parent: "-8733694041155323464",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [1920.0, 1920.0],
          scale: [2.0, 2.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
          image: {
            color: [0.0, 0.0, 0.0, 1.0],
            blend: "normal",
            preserveAspect: false,
          },
        },
        {
          id: "2525764954746698168",
          parent: "-8733694041155323464",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [1920.0, 1080.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
          image: {
            color: [1.0, 1.0, 1.0, 1.0],
            blend: "normal",
            preserveAspect: false,
            textureKey: "still",
          },
        },
      ],
    },
    sequences: [
      {
        id: "0",
        duration: 0.0,
        loop: false,
        tweens: [],
      },
      {
        id: "1",
        duration: 0.0,
        loop: false,
        tweens: [
          {
            node: "-8733694041155323464",
            property: "rotation",
            at: 0.0,
            duration: 0.0,
            ease: 6,
            value: [-0.08726646259971647],
          },
        ],
      },
    ],
  },
  adv_still_anime_000080: {
    layout: {
      referenceWidth: 1920,
      nodes: [
        {
          id: "-6314032619445497861",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [0.0, 0.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
        },
        {
          id: "1506103705664671739",
          parent: "-6314032619445497861",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [0.0, 0.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1.0,
          active: true,
        },
        {
          id: "-8471494825437573125",
          parent: "1506103705664671739",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [1920.0, 1920.0],
          scale: [2.0, 2.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
          image: {
            color: [0.0, 0.0, 0.0, 1.0],
            blend: "normal",
            preserveAspect: false,
          },
        },
        {
          id: "-1392367787804733445",
          parent: "1506103705664671739",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [1920.0, 1080.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
          image: {
            color: [1.0, 1.0, 1.0, 1.0],
            blend: "normal",
            preserveAspect: false,
            textureKey: "still",
          },
        },
      ],
    },
    sequences: [
      {
        id: "0",
        duration: 0.0,
        loop: false,
        tweens: [],
      },
      {
        id: "1",
        duration: 0.0,
        loop: false,
        tweens: [
          {
            node: "1506103705664671739",
            property: "rotation",
            at: 0.0,
            duration: 0.0,
            ease: 6,
            value: [-0.08726646259971647],
          },
        ],
      },
    ],
  },
  adv_still_anime_000081: {
    layout: {
      referenceWidth: 1920,
      nodes: [
        {
          id: "-3855242509874398113",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [0.0, 0.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
        },
        {
          id: "6437076222920129631",
          parent: "-3855242509874398113",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [0.0, 0.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1.0,
          active: true,
        },
        {
          id: "947930819421502559",
          parent: "6437076222920129631",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [1920.0, 1920.0],
          scale: [2.0, 2.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
          image: {
            color: [0.0, 0.0, 0.0, 1.0],
            blend: "normal",
            preserveAspect: false,
          },
        },
        {
          id: "70078676587805791",
          parent: "6437076222920129631",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [1920.0, 1080.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
          image: {
            color: [1.0, 1.0, 1.0, 1.0],
            blend: "normal",
            preserveAspect: false,
            textureKey: "still",
          },
        },
      ],
    },
    sequences: [],
  },
  adv_still_anime_000082: {
    layout: {
      referenceWidth: 1920,
      nodes: [
        {
          id: "-6438207922986577774",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [0.0, 0.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
        },
        {
          id: "-2822546313519066990",
          parent: "-6438207922986577774",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [0.0, 0.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1.0,
          active: true,
        },
        {
          id: "-4574083694574071662",
          parent: "-2822546313519066990",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [1920.0, 1920.0],
          scale: [2.0, 2.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
          image: {
            color: [0.0, 0.0, 0.0, 1.0],
            blend: "normal",
            preserveAspect: false,
          },
        },
        {
          id: "6080016011706142866",
          parent: "-2822546313519066990",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [1920.0, 1080.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
          image: {
            color: [1.0, 1.0, 1.0, 1.0],
            blend: "normal",
            preserveAspect: false,
            textureKey: "still",
          },
        },
      ],
    },
    sequences: [],
  },
  adv_still_anime_000187: {
    layout: {
      referenceWidth: 1920,
      nodes: [
        {
          id: "3744619774916294689",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [0.0, 0.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
        },
        {
          id: "2330395655006713889",
          parent: "3744619774916294689",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [0.0, 0.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1.0,
          active: true,
        },
        {
          id: "-326761646730053599",
          parent: "2330395655006713889",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [1920.0, 1920.0],
          scale: [2.0, 2.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
          image: {
            color: [0.0, 0.0, 0.0, 1.0],
            blend: "normal",
            preserveAspect: false,
          },
        },
        {
          id: "-6904738424815224799",
          parent: "2330395655006713889",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [1920.0, 1080.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
          image: {
            color: [1.0, 1.0, 1.0, 1.0],
            blend: "normal",
            preserveAspect: false,
            textureKey: "still",
          },
        },
      ],
    },
    sequences: [],
  },
  adv_still_charaillust_000016: {
    layout: {
      referenceWidth: 1920,
      nodes: [
        {
          id: "-8679452005872020237",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [0.0, 0.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
        },
        {
          id: "-2282514396221254413",
          parent: "-8679452005872020237",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [0.0, 0.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1.0,
          active: true,
        },
        {
          id: "-3471103846145370893",
          parent: "-2282514396221254413",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [1920.0, 1920.0],
          scale: [2.0, 2.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
          image: {
            color: [0.0, 0.0, 0.0, 1.0],
            blend: "normal",
            preserveAspect: false,
          },
        },
        {
          id: "-4167936047993236237",
          parent: "-2282514396221254413",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [1920.0, 1080.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
          image: {
            color: [1.0, 1.0, 1.0, 1.0],
            blend: "normal",
            preserveAspect: false,
            textureKey: "still",
          },
        },
      ],
    },
    sequences: [],
  },
  adv_still_charaillust_000022: {
    layout: {
      referenceWidth: 1920,
      nodes: [
        {
          id: "-7865203604086945291",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [0.0, 0.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
        },
        {
          id: "-6530499664999314955",
          parent: "-7865203604086945291",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [0.0, 0.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1.0,
          active: true,
        },
        {
          id: "-3985149887066895883",
          parent: "-6530499664999314955",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [1920.0, 1920.0],
          scale: [2.0, 2.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
          image: {
            color: [0.0, 0.0, 0.0, 1.0],
            blend: "normal",
            preserveAspect: false,
          },
        },
        {
          id: "-8341770512274912779",
          parent: "-6530499664999314955",
          anchorMin: [0.5, 0.5],
          anchorMax: [0.5, 0.5],
          pivot: [0.5, 0.5],
          position: [0.0, 0.0],
          size: [1920.0, 1080.0],
          scale: [1.0, 1.0],
          rotation: 0.0,
          opacity: 1,
          active: true,
          image: {
            color: [1.0, 1.0, 1.0, 1.0],
            blend: "normal",
            preserveAspect: false,
            textureKey: "still",
          },
        },
      ],
    },
    sequences: [
      {
        id: "0",
        duration: 0.0,
        loop: false,
        tweens: [],
      },
      {
        id: "1",
        duration: 5.0,
        loop: false,
        tweens: [
          {
            node: "-6530499664999314955",
            property: "position",
            at: 0.0,
            duration: 0.0,
            ease: 6,
            value: [0.0, 95.0],
          },
          {
            node: "-6530499664999314955",
            property: "position",
            at: 0.0,
            duration: 5.0,
            ease: 1,
            value: [0.0, -50.0],
          },
        ],
      },
    ],
  },
};

const sourcePresentations = new WeakMap<object, StoryStillPresentation>();
const sourceRecord = (value: unknown): Record<string, unknown> => {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new TypeError("Invalid native still record");
  return value as Record<string, unknown>;
};
const sourceNumber = (value: unknown): number => {
  if (typeof value !== "number" || !Number.isFinite(value)) throw new TypeError("Invalid native still number");
  return value;
};

const validateSourceSpriteImage = (image: Record<string, unknown>): void => {
  if (image.texture === undefined && image.textureKey === undefined) return;
  if (!image.sprite) throw new TypeError("Missing native still Sprite geometry");
  const sprite = sourceRecord(image.sprite);
  if (!Number.isInteger(sourceNumber(image.type)) || typeof image.useSpriteMesh !== "boolean" ||
      typeof sprite.packed !== "boolean" || !Number.isInteger(sourceNumber(sprite.packingRotation)))
    throw new TypeError("Invalid native still Sprite image type, mesh or packing");
  for (const key of ["serializedFile", "objectId", "sourcePath", "sourceHash", "outputSHA256"])
    if (typeof sprite[key] !== "string" || !sprite[key]) throw new TypeError(`Invalid native still Sprite ${key}`);
  if (!/^-?\d+$/.test(sprite.objectId as string)) throw new TypeError("Invalid native still Sprite objectId");
  for (const key of ["sourceHash", "outputSHA256"])
    if (!/^[0-9a-f]{64}$/i.test(sprite[key] as string)) throw new TypeError(`Invalid native still Sprite ${key}`);
  for (const [key, length] of [
    ["rect", 4], ["textureRect", 4], ["trimOffset", 2],
    ["padding", 4], ["pivot", 2], ["border", 4],
  ] as const) {
    const field = sprite[key];
    if (!Array.isArray(field) || field.length !== length ||
        !field.every((value) => typeof value === "number" && Number.isFinite(value)))
      throw new TypeError(`Invalid native still Sprite ${key}`);
  }
  const rect = sprite.rect as [number, number, number, number];
  const trim = sprite.textureRect as [number, number, number, number];
  const offset = sprite.trimOffset as [number, number];
  const padding = sprite.padding as [number, number, number, number];
  const ppu = sourceNumber(sprite.pixelsPerUnit), settings = sourceNumber(sprite.settingsRaw);
  if (!(rect[2] > 0 && rect[3] > 0 && trim[2] > 0 && trim[3] > 0 && ppu > 0) ||
      !Number.isInteger(settings) || settings < 0 || settings > 0xffffffff ||
      sprite.packed !== Boolean(settings & 1) || sprite.packingRotation !== ((settings >>> 2) & 15) ||
      padding[0] !== offset[0] || padding[1] !== offset[1] ||
      padding[2] !== rect[2] - offset[0] - trim[2] || padding[3] !== rect[3] - offset[1] - trim[3])
    throw new TypeError("Invalid native still Sprite dimensions or settings");
};

/** The host supplies this release-owned document; theme code contains no game assets. */
function sourcePresentation(value: object): StoryStillPresentation {
  const cached = sourcePresentations.get(value);
  if (cached) return cached;
  const document = sourceRecord(value);
  if (document.schema !== "haneoka-still-presentation-v1") throw new TypeError("Unsupported native still schema");
  if (Array.isArray(document.unsupportedFeatures) && document.unsupportedFeatures.length)
    throw new Error(`Native still requires: ${document.unsupportedFeatures.join(", ")}`);
  const layoutDocument = sourceRecord(document.layout);
  if (!Array.isArray(layoutDocument.nodes) || !Array.isArray(document.sequences))
    throw new TypeError("Invalid native still layout/sequences");
  for (const value of layoutDocument.nodes) {
    const node = sourceRecord(value);
    if (typeof node.id !== "string" || (node.parent !== undefined && typeof node.parent !== "string"))
      throw new TypeError("Invalid native still node identity");
    if (layoutDocument.stillExternalLayout !== undefined && node.transformKind !== "rect" && node.transformKind !== "transform")
      throw new TypeError("Missing native still transform kind");
    for (const [key, length] of [
      ["anchorMin", 2],
      ["anchorMax", 2],
      ["pivot", 2],
      ["position", 2],
      ["size", 2],
      ["scale", 2],
      ["rotationQuaternion", 4],
    ] as const) {
      const field = node[key];
      if (
        !Array.isArray(field) ||
        field.length !== length ||
        !field.every((value) => typeof value === "number" && Number.isFinite(value))
      )
        throw new TypeError(`Invalid native still ${key}`);
    }
    for (const key of ["rotation", "positionZ", "scaleZ", "opacity"]) sourceNumber(node[key]);
    if (node.image !== undefined) validateSourceSpriteImage(sourceRecord(node.image));
  }
  // Validation follows the same hierarchy/scaler contract used by the renderer.
  const layout = layoutDocument as unknown as StoryFrameLayout;
  if (layout.stillExternalLayout) validateStoryStillExternalLayout(layout.stillExternalLayout);
  resolveStoryFrameLayout(layout, 1920, 1080);
  const sourceSequences = document.sequences;
  const sequences = sourceSequences.map((value) => {
    const sequence = sourceRecord(value);
    if (typeof sequence.id !== "string" || !Array.isArray(sequence.nativeTweens))
      throw new TypeError("Invalid native still sequence");
    const tweens: StoryStillTween[] = [];
    const unsupported: string[] = [];
    const actions = sequence.timelineActions;
    if (actions !== undefined && !Array.isArray(actions)) throw new TypeError("Invalid native still action bindings");
    if (
      actions === undefined
        ? Array.isArray(sequence.nativeActions) && sequence.nativeActions.length
        : !Array.isArray(sequence.unhandledNativeActions) || sequence.unhandledNativeActions.length
    )
      unsupported.push("native callback");
    const timelineActions = (actions ?? []).map((value) => {
      const action = sourceRecord(value);
      if (
        action.operation !== "restart" ||
        typeof action.sequence !== "string" ||
        !sourceSequences.some((value) => sourceRecord(value).id === action.sequence)
      )
        throw new TypeError("Invalid native still callback binding");
      return { at: sourceNumber(action.at), operation: "restart" as const, sequence: action.sequence };
    });
    const killWith = sequence.killWith;
    if (
      killWith !== undefined &&
      (!Array.isArray(killWith) ||
        killWith.some(
          (id) => typeof id !== "string" || !sourceSequences.some((value) => sourceRecord(value).id === id),
        ))
    )
      throw new TypeError("Invalid native still handle binding");
    for (const value of sequence.nativeTweens) {
      const native = sourceRecord(value),
        raw = sourceRecord(native.raw);
      const type = sourceNumber(native.animationType);
      if (typeof native.node !== "string" || !layout.nodes.some((node) => node.id === native.node))
        throw new TypeError("Missing native still tween target");
      const loops = sourceNumber(raw.loops);
      const loopType = sourceNumber(raw.loopType);
      if (!Number.isSafeInteger(loops) || loops < -1 || (loopType !== 0 && loopType !== 1) || raw.isSpeedBased) {
        unsupported.push(`tween ${type} loop/speed`);
        continue;
      }
      // DOTween converts infinite child tweens to int.MaxValue inside a Sequence.
      const iterations = loops === -1 ? 2147483647 : Math.max(1, loops);
      const common = {
        node: native.node,
        at: sourceNumber(native.at),
        duration: sourceNumber(native.duration),
        iterations,
        loopMode: loopType === 1 ? "yoyo" as const : "restart" as const,
        ease: sourceNumber(native.ease),
        ...(raw.isRelative ? { relative: true } : {}),
        ...(raw.isFrom ? { from: true } : {}),
      };
      const vector = sourceRecord(raw.endValueV3);
      if (type === 1 && raw.targetType === 5 && !raw.optionalBool0) {
        tweens.push(
          { ...common, property: "position", value: [sourceNumber(vector.x), sourceNumber(vector.y)] },
          { ...common, property: "positionZ", value: [sourceNumber(vector.z)] },
        );
      } else if (type === 12 && raw.targetType === 5 && !raw.optionalBool0 &&
        Number(raw.optionalShakeRandomnessMode) === 0 && sourceNumber(vector.x) === sourceNumber(vector.y) &&
        sourceNumber(vector.z) === 0 && common.duration > 0 && sourceNumber(raw.optionalInt0) >= 1) {
        tweens.push({ ...common, property: "position", value: [0, 0], shake: {
          strength: sourceNumber(vector.x), vibrato: sourceNumber(raw.optionalInt0),
          randomness: sourceNumber(raw.optionalFloat0), fadeOut: Boolean(raw.optionalBool1),
        } });
      } else if (type === 3 && raw.targetType === 11 && Number(raw.optionalInt0) <= 1) {
        tweens.push({
          ...common,
          property: "worldRotationEuler",
          rotationMode: Number(raw.optionalInt0) === 0 ? "fast" : "beyond360",
          value: [sourceNumber(vector.x), sourceNumber(vector.y), sourceNumber(vector.z)].map(
            (value) => (value * Math.PI) / 180,
          ),
        });
      } else if (type === 5) {
        const scale = raw.optionalBool0
          ? [sourceNumber(raw.endValueFloat), sourceNumber(raw.endValueFloat), sourceNumber(raw.endValueFloat)]
          : [sourceNumber(vector.x), sourceNumber(vector.y), sourceNumber(vector.z)];
        tweens.push(
          { ...common, property: "scale", value: scale.slice(0, 2) },
          { ...common, property: "scaleZ", value: scale.slice(2) },
        );
      } else if (type === 21 && raw.targetType === 5) {
        const end = sourceRecord(raw.endValueV2);
        const size = raw.optionalBool0
          ? [sourceNumber(raw.endValueFloat), sourceNumber(raw.endValueFloat)]
          : [sourceNumber(end.x), sourceNumber(end.y)];
        tweens.push({ ...common, property: "size", value: size });
      } else if (type === 6 && native.targetKind === "image") {
        const color = sourceRecord(raw.endValueColor);
        tweens.push({
          ...common,
          property: "imageColor",
          value: [sourceNumber(color.r), sourceNumber(color.g), sourceNumber(color.b), sourceNumber(color.a)],
        });
      } else if (type === 7 && native.targetKind === "image") {
        const color = layout.nodes.find((node) => node.id === native.node)?.image?.color;
        if (!color) throw new TypeError("Still image fade target is unavailable");
        tweens.push({
          ...common,
          property: "imageColor",
          value: [color[0], color[1], color[2], sourceNumber(raw.endValueFloat)],
        });
      } else if (type === 7 && native.targetKind === "canvas-group") {
        tweens.push({ ...common, property: "opacity", value: [sourceNumber(raw.endValueFloat)] });
      } else unsupported.push(`tween ${type} target ${raw.targetType}`);
    }
    return {
      id: sequence.id,
      duration: sourceNumber(sequence.duration),
      loop: sequence.loop === true,
      tweens,
      ...(actions !== undefined
        ? { actions: timelineActions, ...(killWith !== undefined ? { killWith } : {}) }
        : {}),
      ...(unsupported.length ? { unsupportedFeatures: [...new Set(unsupported)] } : {}),
    };
  });
  const result = { layout, sequences };
  sourcePresentations.set(value, result);
  return result;
}

export const haneokaStillPresentations: StoryStillPresentationProvider = {
  resolve(still) {
    if (still.presentation && typeof still.presentation === "object") return sourcePresentation(still.presentation);
    const name = String(still.assetName || still.sourcePath || still.url || "")
      .split("/")
      .at(-1)
      ?.split("?")[0]
      ?.replace(/\.(?:prefab|png)$/u, "");
    return name ? presentations[name] : undefined;
  },
};
