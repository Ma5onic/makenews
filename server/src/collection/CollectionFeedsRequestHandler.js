import CouchClient from "../CouchClient";
import R from "ramda"; //eslint-disable-line id-length
import { FEED_LIMIT_TO_DELETE_IN_QUERY } from "../util/Constants";

export async function getCollectedFeeds(authSession, collection, offset) {
    const couchClient = CouchClient.instance(authSession);
    const feedIds = await getFeedIds(couchClient, collection, offset);
    return await getFeeds(couchClient, feedIds.docs);
}

async function getFeeds(couchClient, feedIds) {
    const feedPromises = feedIds.map(async (collection) => {
        try {
            return await couchClient.getDocument(collection.feedId);
        } catch(error) {
            return {};
        }
    });
    const feeds = await Promise.all(feedPromises);
    return R.reject(R.isEmpty, feeds);
}

async function getFeedIds(couchClient, collection, offset) {
    const selector = {
        "selector": {
            "docType": {
                "$eq": "collectionFeed"
            }, "collectionId": {
                "$eq": collection
            }
        },
        "skip": offset
    };
    return await couchClient.findDocuments(selector);
}

export async function getCollectionFeedIds(couchClient, sourceIds, feeds = [], skipValue = 0) { // eslint-disable-line no-magic-numbers

    const collectionFeedDocs = await getCollectionFeedDocs(couchClient, skipValue, sourceIds);
    const feedsAccumulator = feeds.concat(collectionFeedDocs);

    if(collectionFeedDocs.length === FEED_LIMIT_TO_DELETE_IN_QUERY) {
        return await getCollectionFeedIds(couchClient, sourceIds, feedsAccumulator, skipValue + FEED_LIMIT_TO_DELETE_IN_QUERY);
    }

    return R.map(feed => feed.feedId, feedsAccumulator);
}

async function getCollectionFeedDocs(couchClient, skipValue, sources) {
    const selector = {
        "selector": {
            "docType": {
                "$eq": "collectionFeed"
            },
            "sourceId": {
                "$in": sources
            }
        },
        "fields": ["feedId"],
        "skip": skipValue,
        "limit": FEED_LIMIT_TO_DELETE_IN_QUERY
    };
    const collectionFeedDocs = await couchClient.findDocuments(selector);
    return collectionFeedDocs.docs;
}
