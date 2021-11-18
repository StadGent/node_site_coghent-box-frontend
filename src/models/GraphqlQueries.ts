export const GetAssetEntity = `query getEntityById($id: String!) {
                                Entity(id: $id) {
                                  id
                                  type
                                  title: metadata(key: [title]) {
                                    key
                                    value
                                  }
                                  metadata(key: [type, collection]) {
                                    key
                                    value
                                  }
                                  mediafiles {
                                    _id
                                    original_file_location
                                  }
                                }
                              }`;
