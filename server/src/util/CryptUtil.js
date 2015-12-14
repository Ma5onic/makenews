"use strict";
import StringUtil from "../../../common/src/util/StringUtil.js";
import crypto from "crypto";

export default class CryptUtil {
    static hmac(algorithm, key, digest, data) {
        if(StringUtil.isEmptyString(algorithm) || StringUtil.isEmptyString(key) || StringUtil.isEmptyString(digest)) {
            throw new Error("algorithm or key or digest can not be empty");
        }

        let appSecretProof = crypto.createHmac(algorithm, key);
        appSecretProof.setEncoding(digest);
        if(data) {
            appSecretProof.write(data);
        }
        appSecretProof.end();
        let hash = appSecretProof.read();
        return hash;
    }
}