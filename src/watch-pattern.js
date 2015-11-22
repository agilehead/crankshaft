/* @flow */
import { ensureLeadingSlash, ensureTrailingSlash, resolveDirPath } from "./filepath-utils";

export default class WatchPattern {

    file: string;
    dir: string;
    important: boolean;
    regex: RegExp;
    exclude: string;
    recurse: boolean;

    constructor(file: string, dir: string, exclude: string = "file", recurse: boolean = true, important: boolean = false) {
        this.file = file;
        this.dir = dir;
        this.important = important;
        this.exclude = exclude;
        this.recurse = recurse;

        if (this.exclude) {
            switch(this.exclude) {
                case "dir":
                    if (this.recurse) {
                        if (!this.regex) {
                            this.regex = new RegExp(ensureLeadingSlash(ensureTrailingSlash(this.dir)).replace(/\//g, "\\/"));
                        }
                    } else {
                        if (!this.regex) {
                            this.regex = new RegExp("^" + resolveDirPath(parent.root, this.dir).replace(/\//g, "\\/"));
                        }
                    }
                    break;
                case "file":
                    if (!this.regex) {
                        const excludeBaseDir = resolveDirPath(parent.root, this.dir).replace(/\//g, "\\/");
                        this.regex = new RegExp(excludeBaseDir + "(.*\\/)?" + (this.file.replace(".", "\\.").replace("*", ".*") + "$"));
                    }
                    break;
                default:
                    throw new Error("Exclude type must be 'dir' or 'file'");
            }
        } else {
            if (!this.regex) {
                const patternBaseDir = resolveDirPath(parent.root, this.dir).replace(/\//g, "\\/");
                this.regex = new RegExp(patternBaseDir + "(.*\\/)?" + (this.file.replace(".", "\\.").replace("*", ".*") + "$"));
            }
        }
    }
}