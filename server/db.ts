// Mock database implementation - no MongoDB required
// Uses in-memory storage for development/demo purposes

interface MockCollection {
    data: Record<string, unknown>[];
    name: string;
}

interface MockDb {
    collections: Map<string, MockCollection>;
    collection: (name: string) => MockCollectionMethods;
}

interface MockCollectionMethods {
    find: (filter?: Record<string, unknown>) => {
        sort: (sortObj: Record<string, number>) => {
            skip: (n: number) => {
                limit: (n: number) => {
                    toArray: () => Promise<Record<string, unknown>[]>;
                };
            };
            limit: (n: number) => {
                toArray: () => Promise<Record<string, unknown>[]>;
            };
            toArray: () => Promise<Record<string, unknown>[]>;
        };
        limit: (n: number) => {
            toArray: () => Promise<Record<string, unknown>[]>;
        };
        toArray: () => Promise<Record<string, unknown>[]>;
    };
    findOne: (filter: Record<string, unknown>) => Promise<Record<string, unknown> | null>;
    insertOne: (doc: Record<string, unknown>) => Promise<{ insertedId: string }>;
    insertMany: (docs: Record<string, unknown>[]) => Promise<{ insertedCount: number }>;
    updateOne: (filter: Record<string, unknown>, update: Record<string, unknown>) => Promise<{ matchedCount: number; modifiedCount: number }>;
    deleteOne: (filter: Record<string, unknown>) => Promise<{ deletedCount: number }>;
    countDocuments: (filter?: Record<string, unknown>) => Promise<number>;
    aggregate: (pipeline: object[]) => {
        toArray: () => Promise<Record<string, unknown>[]>;
    };
    createIndex: (keys: Record<string, unknown>, options?: Record<string, unknown>) => Promise<string>;
}

// In-memory data storage
const mockData: Map<string, Record<string, unknown>[]> = new Map();

// Initialize with default data
mockData.set('adminUsers', [
    {
        _id: 'admin-001',
        username: 'admin',
        password: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', // sha256('admin1234')
        role: 'admin',
        createdAt: new Date(),
    }
]);

mockData.set('inquiries', [
    {
        _id: 'inq-001',
        name: '홍길동',
        email: 'hong@example.com',
        phone: '010-1234-5678',
        eventType: 'wedding',
        eventDate: new Date('2026-06-15'),
        guestCount: 100,
        message: '웨딩 케이터링 견적 요청합니다.',
        status: 'pending',
        createdAt: new Date('2026-02-01'),
    },
    {
        _id: 'inq-002',
        name: '김철수',
        email: 'kim@company.com',
        phone: '010-9876-5432',
        eventType: 'corporate',
        eventDate: new Date('2026-03-20'),
        guestCount: 50,
        message: '기업 행사 케이터링 문의',
        status: 'confirmed',
        createdAt: new Date('2026-02-03'),
    }
]);

mockData.set('notices', [
    {
        _id: 'notice-001',
        title: '2026년 새해 인사',
        content: '새해 복 많이 받으세요! 산동 레스토랑이 함께합니다.',
        isPublished: true,
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
    }
]);

mockData.set('documents', []);
mockData.set('chatSessions', []);

// Generate unique ID
const generateId = (): string => {
    return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
};

// Create mock collection methods
const createMockCollection = (collectionName: string): MockCollectionMethods => {
    const getData = (): Record<string, unknown>[] => {
        if (!mockData.has(collectionName)) {
            mockData.set(collectionName, []);
        }
        return mockData.get(collectionName)!;
    };

    const matchesFilter = (doc: Record<string, unknown>, filter: Record<string, unknown>): boolean => {
        for (const key of Object.keys(filter)) {
            if (key === '$or') {
                const orConditions = filter[key] as Record<string, unknown>[];
                if (!orConditions.some(cond => matchesFilter(doc, cond))) {
                    return false;
                }
            } else if (typeof filter[key] === 'object' && filter[key] !== null) {
                const filterVal = filter[key] as Record<string, unknown>;
                if ('$regex' in filterVal) {
                    const regex = new RegExp(filterVal.$regex as string, (filterVal.$options as string) || '');
                    if (!regex.test(String(doc[key] || ''))) {
                        return false;
                    }
                }
            } else if (doc[key] !== filter[key]) {
                return false;
            }
        }
        return true;
    };

    return {
        find: (filter?: Record<string, unknown>) => {
            let results = getData();
            if (filter && Object.keys(filter).length > 0) {
                results = results.filter(doc => matchesFilter(doc, filter));
            }

            const createChain = (data: Record<string, unknown>[]) => ({
                sort: (sortObj: Record<string, number>) => {
                    const sorted = [...data].sort((a, b) => {
                        for (const [key, dir] of Object.entries(sortObj)) {
                            const aVal = a[key] as number | Date | string;
                            const bVal = b[key] as number | Date | string;
                            if (aVal < bVal) return -dir;
                            if (aVal > bVal) return dir;
                        }
                        return 0;
                    });
                    return createChain(sorted);
                },
                skip: (n: number) => createChain(data.slice(n)),
                limit: (n: number) => createChain(data.slice(0, n)),
                toArray: () => Promise.resolve([...data]),
            });

            return createChain(results);
        },

        findOne: async (filter: Record<string, unknown>) => {
            const data = getData();
            return data.find(doc => matchesFilter(doc, filter)) || null;
        },

        insertOne: async (doc: Record<string, unknown>) => {
            const data = getData();
            const newDoc = { ...doc, _id: doc._id || generateId() };
            data.push(newDoc);
            return { insertedId: newDoc._id as string };
        },

        insertMany: async (docs: Record<string, unknown>[]) => {
            const data = getData();
            docs.forEach(doc => {
                data.push({ ...doc, _id: doc._id || generateId() });
            });
            return { insertedCount: docs.length };
        },

        updateOne: async (filter: Record<string, unknown>, update: Record<string, unknown>) => {
            const data = getData();
            const index = data.findIndex(doc => matchesFilter(doc, filter));
            if (index !== -1) {
                if (update.$set) {
                    Object.assign(data[index], update.$set);
                } else {
                    Object.assign(data[index], update);
                }
                return { matchedCount: 1, modifiedCount: 1 };
            }
            return { matchedCount: 0, modifiedCount: 0 };
        },

        deleteOne: async (filter: Record<string, unknown>) => {
            const data = getData();
            const index = data.findIndex(doc => matchesFilter(doc, filter));
            if (index !== -1) {
                data.splice(index, 1);
                return { deletedCount: 1 };
            }
            return { deletedCount: 0 };
        },

        countDocuments: async (filter?: Record<string, unknown>) => {
            let data = getData();
            if (filter && Object.keys(filter).length > 0) {
                data = data.filter(doc => matchesFilter(doc, filter));
            }
            return data.length;
        },

        aggregate: (pipeline: object[]) => {
            // Simplified aggregation - just return mock data
            return {
                toArray: async () => {
                    const data = getData();
                    // Handle $group for customer aggregation
                    if (pipeline.some((stage: Record<string, unknown>) => stage.$group)) {
                        const grouped = new Map<string, Record<string, unknown>>();
                        data.forEach(doc => {
                            const email = doc.email as string;
                            if (!grouped.has(email)) {
                                grouped.set(email, {
                                    _id: email,
                                    name: doc.name,
                                    phone: doc.phone,
                                    totalInquiries: 0,
                                    lastInquiry: doc.createdAt,
                                    statuses: [],
                                });
                            }
                            const g = grouped.get(email)!;
                            (g.totalInquiries as number)++;
                            (g.statuses as string[]).push(doc.status as string);
                            if ((doc.createdAt as Date) > (g.lastInquiry as Date)) {
                                g.lastInquiry = doc.createdAt;
                            }
                        });
                        return Array.from(grouped.values());
                    }
                    // Handle $count
                    if (pipeline.some((stage: Record<string, unknown>) => stage.$count)) {
                        return [{ total: data.length }];
                    }
                    return data;
                },
            };
        },

        createIndex: async () => {
            return 'mock-index';
        },
    };
};

// Mock database instance
let mockDb: MockDb | null = null;

export const connectDB = async (): Promise<MockDb> => {
    if (mockDb) return mockDb;

    console.log('🎭 Running in MOCK MODE - No MongoDB required');
    console.log('📦 Using in-memory database with sample data');

    mockDb = {
        collections: new Map(),
        collection: (name: string) => createMockCollection(name),
    };

    console.log('📇 Mock database initialized');
    console.log('👤 Default admin: admin / admin1234');

    return mockDb;
};

export const getDB = (): MockDb => {
    if (!mockDb) {
        // Auto-initialize if not connected
        mockDb = {
            collections: new Map(),
            collection: (name: string) => createMockCollection(name),
        };
    }
    return mockDb;
};

export const closeDB = async () => {
    mockDb = null;
    console.log('📦 Mock database closed');
};
