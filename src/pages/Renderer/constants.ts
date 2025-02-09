export const ENCODED_POINT_INDICES_PROTO_DEFINITION = `syntax = "proto3";

message Uint32Array {
    repeated uint32 values = 1; // A single array of Uint32 values
}

message Uint32Matrix {
    repeated Uint32Array rows = 1; // An array of Uint32Array
}`;

export interface Uint32Matrix {
    rows: Uint32Array[];
}