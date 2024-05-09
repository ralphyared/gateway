import config from "./global/config.js";

export const routes = [
  {
    api: "/api/v1/signup",
    microserviceUrl: `${config().microserviceUrls.idp}/user/signup`,
    microserviceName: "idp",
    methods: ["post"],
  },
  {
    api: "/api/v1/login",
    microserviceUrl: `${config().microserviceUrls.idp}/user/login`,
    microserviceName: "idp",
    methods: ["post"],
  },
  {
    api: "/api/v1/profile",
    microserviceUrl: `${config().microserviceUrls.idp}/user/profile`,
    microserviceName: "idp",
    methods: ["get"],
    isAuthenticated: true,
  },
  {
    api: "/api/v1/profile/edit",
    microserviceUrl: `${config().microserviceUrls.idp}/user/profile/edit`,
    microserviceName: "idp",
    methods: ["put"],
    isAuthenticated: true,
  },
  {
    api: "/api/v1/rate-video/:id",
    microserviceUrl: `${
      config().microserviceUrls.videoProvider
    }/ratings/add/:id`,
    microserviceName: "idp",
    methods: ["post"],
    isAuthenticated: true,
  },
  {
    api: "/api/v1/all-videos",
    microserviceUrl: `${config().microserviceUrls.videoProvider}/videos/all`,
    microserviceName: "idp",
    methods: ["get"],
  },
  {
    api: "/api/v1/play-video/:id",
    microserviceUrl: `${
      config().microserviceUrls.videoProvider
    }/videos/play/:id`,
    microserviceName: "idp",
    methods: ["get"],
    isAuthenticated: true,
  },
  {
    api: "/api/v1/create-video",
    microserviceUrl: `${config().microserviceUrls.videoProvider}/videos/create`,
    microserviceName: "idp",
    methods: ["post"],
    isAuthenticated: true,
  },
  {
    api: "/api/v1/comment/:id",
    microserviceUrl: `${
      config().microserviceUrls.videoProvider
    }/comments/create/:id`,
    microserviceName: "idp",
    methods: ["post"],
    isAuthenticated: true,
  },
  {
    api: "/api/v1/reply/:id",
    microserviceUrl: `${
      config().microserviceUrls.videoProvider
    }/comments/reply/:id`,
    microserviceName: "idp",
    methods: ["post"],
    isAuthenticated: true,
  },
  {
    api: "/api/v1/update-comment/:id",
    microserviceUrl: `${
      config().microserviceUrls.videoProvider
    }/comments/update/:id`,
    microserviceName: "idp",
    methods: ["put"],
    isAuthenticated: true,
  },
  {
    api: "/api/v1/view-comments/:id",
    microserviceUrl: `${
      config().microserviceUrls.videoProvider
    }/comments/view/:id`,
    microserviceName: "idp",
    methods: ["get"],
    isAuthenticated: true,
  },
];
