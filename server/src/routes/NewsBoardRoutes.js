import FetchAllConfiguredFeeds from "./helpers/FetchAllConfiguredFeedsRoute";
import BookmarkRoute from "./helpers/BookmarkRoute";
import BookmarkedFeedsRoute from "./helpers/BookmarkedFeedsRoute";
import CollectionRoute from "./helpers/CollectionRoute";
import RouteLogger from "./RouteLogger";

export default (app) => {
    app.get("/feeds", (request, response) => {
        RouteLogger.instance().info("fetchAllConfiguredFeedsRoute:: /feeds-from-all-sources request received. url = %s", request.url);
        new FetchAllConfiguredFeeds(request, response).fetchFeeds();
    });

    app.post("/bookmarks", (request, response) => {
        RouteLogger.instance().info("bookmarkRoute:: POST /bookmark request received. url = %s", request.url);
        new BookmarkRoute(request, response).bookmarkFeed();
    });

    app.get("/bookmarks", (request, response) => {
        RouteLogger.instance().info("bookmarkedFeedsRoute:: GET /bookmarks request received. url = %s", request.url);
        new BookmarkedFeedsRoute(request, response).getFeeds();
    });

    app.put("/collection", (request, response) => {
        RouteLogger.instance().info("collectionRoute:: PUT /collection request received. url = %s", request.url);
        new CollectionRoute(request, response).addToCollection();
    });

    app.get("/collections", (request, response) => {
        RouteLogger.instance().info("collectionRoute:: GET /collection request received. url = %s", request.url);
        new CollectionRoute(request, response).getAllCollections();
    });
};
