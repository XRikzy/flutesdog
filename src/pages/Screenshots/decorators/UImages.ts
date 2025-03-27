export interface Images {
    fileId?:            string;
    type:               string;
    name:               string;
    filePath?:          string;
    tags?:              string[];
    AITags?:            AITag[];
    versionInfo?:       VersionInfo;
    isPrivateFile?:     boolean;
    customCoordinates?: null;
    url?:               string;
    thumbnail?:         string;
    fileType?:          string;
    mime?:              string;
    width?:             number;
    height?:            number;
    size?:              number;
    hasAlpha?:          boolean;
    customMetadata?:    CustomMetadata;
    createdAt:          Date;
    updatedAt:          Date;
    folderId?:          string;
    folderPath?:        string;
}

export interface AITag {
    name:       string;
    confidence: number;
    source:     string;
}

export interface CustomMetadata {
    brand: string;
    color: string;
}

export interface VersionInfo {
    id:   string;
    name: string;
}
