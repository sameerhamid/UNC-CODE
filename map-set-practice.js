/**
 * MAP / SET PRACTICE — modeled on astroapp-apis data shapes
 *
 * Run with:  node map-set-practice.js
 *
 * Rules to make this real practice:
 *   - NO nested loops. If you write `arr.find(...)` inside a `.map(...)`, you failed.
 *     Build a Map once, then look up. That is the whole point.
 *   - Use Set whenever you need "distinct ids to fetch" or "does this pair exist".
 *   - Amounts are in PAISA (integer). Display as `₹ 123.45`.
 *   - Guard for missing rows. Some ids below are deliberately orphaned.
 *
 * pocketly-util helpers you'd use in the real codebase (native equivalents given):
 *   arr.mapBy(it => it.id)        → new Map(arr.map(it => [it.id, it]))   // id -> row
 *   arr.groupBy(it => it.userId)  → id -> row[]  (Map)
 *   map.mapValues(v => ...)       → transform every value, keep keys
 *   map.getValuesArray()          → Array.from(map.values())
 *   map.getOrDefault(k, def)
 *   arr.toSet() / set.toArray()
 *   arr.distinct() / arr.distinctBy(fn)
 *   arr.filterNeitherNullNorUndefined()
 *   arr.sumBy(fn) / arr.averageBy(fn) / arr.sortBy(fn) / arr.maxBy(fn)
 */

// ─────────────────────────────────────────────────────────────────────────────
// THE DATA  (pretend each of these came from a different DAO call)
// ─────────────────────────────────────────────────────────────────────────────

const users = [
    { id: 101, name: 'Rahul Sharma', mobile: '9811111111', city: 'Delhi', isActive: 1, createdAt: '2026-01-04' },
    { id: 102, name: 'Priya Nair', mobile: '9822222222', city: 'Kochi', isActive: 1, createdAt: '2026-01-09' },
    { id: 103, name: 'Amit Verma', mobile: '9833333333', city: 'Delhi', isActive: 1, createdAt: '2026-02-14' },
    { id: 104, name: 'Sneha Patil', mobile: '9844444444', city: 'Pune', isActive: 0, createdAt: '2026-02-20' },
    { id: 105, name: 'Imran Khan', mobile: '9855555555', city: 'Mumbai', isActive: 1, createdAt: '2026-03-02' },
    { id: 106, name: 'Divya Rao', mobile: '9866666666', city: 'Kochi', isActive: 1, createdAt: '2026-03-11' },
];

const astrologers = [
    { id: 5001, name: 'Pt. Ganesh', languages: ['hindi', 'english'], skills: ['vedic', 'numerology'], perMinutePricePaisa: 2500, isActive: 1, isOnline: 1 },
    { id: 5002, name: 'Acharya Meera', languages: ['hindi', 'marathi'], skills: ['tarot'], perMinutePricePaisa: 4000, isActive: 1, isOnline: 0 },
    { id: 5003, name: 'Guru Ravi', languages: ['tamil', 'english'], skills: ['vedic', 'palmistry'], perMinutePricePaisa: 1500, isActive: 1, isOnline: 1 },
    { id: 5004, name: 'Shastri Anand', languages: ['hindi'], skills: ['vastu'], perMinutePricePaisa: 6000, isActive: 0, isOnline: 0 },
    // NOTE: astrologer 5009 appears in connectionRequests but NOT here. Deliberate.
];

// status: INITIATED | IN_PROGRESS | COMPLETED | CANCELLED | ASTROLOGER_MISSED
const connectionRequests = [
    { id: 9001, userId: 101, astrologerId: 5001, type: 'CHAT', status: 'COMPLETED', durationSeconds: 620, amountPaisa: 25833, createdAt: '2026-07-01T10:00:00Z' },
    { id: 9002, userId: 101, astrologerId: 5003, type: 'CALL', status: 'COMPLETED', durationSeconds: 300, amountPaisa: 7500, createdAt: '2026-07-02T11:30:00Z' },
    { id: 9003, userId: 102, astrologerId: 5001, type: 'CHAT', status: 'CANCELLED', durationSeconds: 0, amountPaisa: 0, createdAt: '2026-07-02T12:00:00Z' },
    { id: 9004, userId: 102, astrologerId: 5002, type: 'CALL', status: 'COMPLETED', durationSeconds: 900, amountPaisa: 60000, createdAt: '2026-07-03T09:15:00Z' },
    { id: 9005, userId: 103, astrologerId: 5009, type: 'CHAT', status: 'COMPLETED', durationSeconds: 450, amountPaisa: 18000, createdAt: '2026-07-03T18:45:00Z' },
    { id: 9006, userId: 103, astrologerId: 5001, type: 'CHAT', status: 'ASTROLOGER_MISSED', durationSeconds: 0, amountPaisa: 0, createdAt: '2026-07-04T08:00:00Z' },
    { id: 9007, userId: 105, astrologerId: 5003, type: 'CHAT', status: 'COMPLETED', durationSeconds: 1200, amountPaisa: 30000, createdAt: '2026-07-05T14:20:00Z' },
    { id: 9008, userId: 105, astrologerId: 5003, type: 'CALL', status: 'IN_PROGRESS', durationSeconds: null, amountPaisa: null, createdAt: '2026-07-06T15:00:00Z' },
    { id: 9009, userId: 105, astrologerId: 5002, type: 'CHAT', status: 'COMPLETED', durationSeconds: 180, amountPaisa: 12000, createdAt: '2026-07-06T16:10:00Z' },
    { id: 9010, userId: 106, astrologerId: 5001, type: 'CALL', status: 'COMPLETED', durationSeconds: 60, amountPaisa: 2500, createdAt: '2026-07-07T10:05:00Z' },
    { id: 9011, userId: 101, astrologerId: 5001, type: 'CHAT', status: 'COMPLETED', durationSeconds: 240, amountPaisa: 10000, createdAt: '2026-07-08T19:00:00Z' },
    { id: 9012, userId: 104, astrologerId: 5004, type: 'CHAT', status: 'CANCELLED', durationSeconds: 0, amountPaisa: 0, createdAt: '2026-07-08T20:00:00Z' },
];

// type: RECHARGE (credit) | CONSULTATION (debit) | REFUND (credit) | GIFT (debit)
const walletTransactions = [
    { id: 7001, userId: 101, type: 'RECHARGE', amountPaisa: 50000, connectionRequestId: null, createdAt: '2026-06-30T09:00:00Z' },
    { id: 7002, userId: 101, type: 'CONSULTATION', amountPaisa: -25833, connectionRequestId: 9001, createdAt: '2026-07-01T10:11:00Z' },
    { id: 7003, userId: 101, type: 'CONSULTATION', amountPaisa: -7500, connectionRequestId: 9002, createdAt: '2026-07-02T11:36:00Z' },
    { id: 7004, userId: 102, type: 'RECHARGE', amountPaisa: 100000, connectionRequestId: null, createdAt: '2026-07-01T08:00:00Z' },
    { id: 7005, userId: 102, type: 'CONSULTATION', amountPaisa: -60000, connectionRequestId: 9004, createdAt: '2026-07-03T09:31:00Z' },
    { id: 7006, userId: 103, type: 'RECHARGE', amountPaisa: 20000, connectionRequestId: null, createdAt: '2026-07-03T18:00:00Z' },
    { id: 7007, userId: 103, type: 'CONSULTATION', amountPaisa: -18000, connectionRequestId: 9005, createdAt: '2026-07-03T18:53:00Z' },
    { id: 7008, userId: 105, type: 'RECHARGE', amountPaisa: 75000, connectionRequestId: null, createdAt: '2026-07-05T14:00:00Z' },
    { id: 7009, userId: 105, type: 'CONSULTATION', amountPaisa: -30000, connectionRequestId: 9007, createdAt: '2026-07-05T14:41:00Z' },
    { id: 7010, userId: 105, type: 'CONSULTATION', amountPaisa: -12000, connectionRequestId: 9009, createdAt: '2026-07-06T16:13:00Z' },
    { id: 7011, userId: 105, type: 'GIFT', amountPaisa: -5000, connectionRequestId: 9007, createdAt: '2026-07-05T14:35:00Z' },
    { id: 7012, userId: 106, type: 'RECHARGE', amountPaisa: 10000, connectionRequestId: null, createdAt: '2026-07-07T10:00:00Z' },
    { id: 7013, userId: 106, type: 'CONSULTATION', amountPaisa: -2500, connectionRequestId: 9010, createdAt: '2026-07-07T10:07:00Z' },
    { id: 7014, userId: 101, type: 'CONSULTATION', amountPaisa: -10000, connectionRequestId: 9011, createdAt: '2026-07-08T19:05:00Z' },
    { id: 7015, userId: 102, type: 'REFUND', amountPaisa: 5000, connectionRequestId: 9003, createdAt: '2026-07-02T12:05:00Z' },
];

const reviews = [
    { id: 8001, userId: 101, astrologerId: 5001, connectionRequestId: 9001, rating: 5, text: 'Very accurate', isHidden: 0 },
    { id: 8002, userId: 101, astrologerId: 5003, connectionRequestId: 9002, rating: 4, text: 'Good', isHidden: 0 },
    { id: 8003, userId: 102, astrologerId: 5002, connectionRequestId: 9004, rating: 2, text: 'Not satisfied', isHidden: 0 },
    { id: 8004, userId: 105, astrologerId: 5003, connectionRequestId: 9007, rating: 5, text: 'Amazing session', isHidden: 0 },
    { id: 8005, userId: 105, astrologerId: 5002, connectionRequestId: 9009, rating: 1, text: 'abusive language here', isHidden: 1 },
    { id: 8006, userId: 106, astrologerId: 5001, connectionRequestId: 9010, rating: 3, text: null, isHidden: 0 },
    { id: 8007, userId: 103, astrologerId: 5009, connectionRequestId: 9005, rating: 4, text: 'Nice', isHidden: 0 },
    { id: 8008, userId: 101, astrologerId: 5001, connectionRequestId: 9011, rating: 4, text: 'Again good', isHidden: 0 },
];

// blocked pairs — user has blocked astrologer
const blocks = [
    { userId: 102, astrologerId: 5001 },
    { userId: 105, astrologerId: 5002 },
    { userId: 103, astrologerId: 5004 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Q1 — MAP LOOKUP (the bread and butter)
// Build `getRecentConnections()`: return connectionRequests as a display list,
// each item: { connectionRequestId, userName, astrologerName, type, status,
//              displayAmount: '₹ 258.33', displayDuration: '10m 20s' }
// Requirements:
//   - ONE pass over users, ONE over astrologers (to build Maps), then one map().
//   - Orphan astrologer 5009 must render astrologerName: 'Unknown Astrologer'.
//   - Null durationSeconds/amountPaisa must render '-' not 'NaN' or '₹ null'.
//   - Sort newest first.
// ─────────────────────────────────────────────────────────────────────────────

// Q2 — SET (distinct ids to fetch)
// You are given ONLY `connectionRequests`. Produce:
//   { distinctUserIds: [...], distinctAstrologerIds: [...],
//     astrologerIdsNotInDb: [...],        // present in requests but missing from `astrologers`
//     usersWhoNeverConnected: [...] }     // in `users` but no request at all
// Use Set, not array.includes() in a loop.

// Q3 — GROUP BY + AGGREGATE
// Build `getAstrologerStats()`: for EVERY astrologer in `astrologers` (even ones
// with zero requests), return:
//   { astrologerId, name, totalRequests, completedRequests, totalEarningsPaisa,
//     displayEarnings, avgRating (null if no visible review, else 1 decimal),
//     distinctUserCount }
// Rules:
//   - Only COMPLETED requests count toward earnings.
//   - Hidden reviews (isHidden: 1) are excluded from avgRating.
//   - distinctUserCount = unique users who ever raised a request with them.
//   - Astrologer 5004 must appear with zeros, not be missing.

// Q4 — MAP OF MAP (two-level grouping)
// Build a nested structure: city -> connectionType -> count of COMPLETED requests.
// Expected shape: { Delhi: { CHAT: 2, CALL: 1 }, Kochi: {...}, ... }
// You must join request -> user -> city. Skip requests whose user is missing.

// Q5 — RECONCILIATION (the classic bug hunt)
// Every COMPLETED request should have exactly one CONSULTATION walletTransaction
// whose connectionRequestId matches AND whose |amountPaisa| equals request.amountPaisa.
// Return:
//   { missingTransaction: [reqIds...],      // completed but no CONSULTATION txn
//     amountMismatch: [{ reqId, reqAmount, txnAmount }],
//     orphanTransactions: [txnIds...] }     // CONSULTATION txn pointing at a
//                                           // reqId that doesn't exist or isn't COMPLETED
// (There IS at least one real problem in the data. Find it.)

// Q6 — SET LOOKUP ON A COMPOSITE KEY
// Build `getAstrologerListForUser(userId)`: return astrologers this user is allowed
// to see — active astrologers, excluding ones they've blocked, each with:
//   { astrologerId, name, perMinuteDisplay: '₹ 25/min', isOnline,
//     hasConsultedBefore: true/false, lastRatingGiven: number|null }
// The block check must be O(1) via a Set of composite keys like `${userId}-${astrologerId}`.
// Test it with userId 105 and userId 104.

// Q7 — WALLET BALANCE PER USER
// Build a Map userId -> balancePaisa (sum of all their transactions), then produce
// a JSON list of users sorted by balance descending:
//   { userId, name, balancePaisa, displayBalance, isLowBalance: balance < 5000 }
// Users with zero transactions must appear with balance 0.

// Q8 — INVERT A MAP
// Given the reviews, build: rating (1..5) -> array of astrologer NAMES who received
// that rating at least once (visible reviews only, names sorted A-Z, no duplicates).

// ─────────────────────────────────────────────────────────────────────────────
// Write your solutions below. console.log each answer.
// ─────────────────────────────────────────────────────────────────────────────

const toRupees = paisa => (paisa === null || paisa === undefined ? '-' : `₹ ${(paisa / 100).toFixed(2)}`);

function getRecentConnections() {
    const $users = new Map(users.map(user => [user.id, user]));
    const $astrologers = new Map(astrologers.map(user => [user.id, user]));
    // for (let user of users) {
    //     $users.set(user.id, user);
    // }
    // for (let astrologer of astrologers) {
    //     $astrologers.set(astrologer.id, astrologer);
    // }

    const returnData = connectionRequests.map(it => {
        const user = $users.get(it.userId);
        const astrologerName = (() => {
            const astrologer = $astrologers.get(it.astrologerId);
            if (!astrologer) {
                return "Unknown Astrologer"
            } else {
                return astrologer.name
            }
        })();
        return  { connectionRequestId: it.id, userName: user.name, astrologerName, type: it.type, status: it.status,
             displayAmount: toRupees(it.amountPaisa), displayDuration: it.durationSeconds }
    }).sort(it => -it.createdAt)
    return returnData;
}
// Q3 — GROUP BY + AGGREGATE
// Build `getAstrologerStats()`: for EVERY astrologer in `astrologers` (even ones
// with zero requests), return:
//   { astrologerId, name, totalRequests, completedRequests, totalEarningsPaisa,
//     displayEarnings, avgRating (null if no visible review, else 1 decimal),
//     distinctUserCount }
// Rules:
//   - Only COMPLETED requests count toward earnings.
//   - Hidden reviews (isHidden: 1) are excluded from avgRating.
//   - distinctUserCount = unique users who ever raised a request with them.
//   - Astrologer 5004 must appear with zeros, not be missing.

function getAstrologerStats() {
    const connectionRequestGroupByAstrologerId = new Map();
    const reviewsGroupByAstrologerId = new Map();
    for (let connectionRequest of connectionRequests) {
        const items = connectionRequestGroupByAstrologerId.get(connectionRequest.astrologerId);
        if (items?.length) {
            connectionRequestGroupByAstrologerId.set(connectionRequest.astrologerId, [...items, connectionRequest])
        } else {
            connectionRequestGroupByAstrologerId.set(connectionRequest.astrologerId, [connectionRequest])
        }
    }

    for (let review of reviews) {
        const items = reviewsGroupByAstrologerId.get(review.astrologerId);
        if (items?.length) {
            reviewsGroupByAstrologerId.set(review.astrologerId, [...items, review])
        } else {
            reviewsGroupByAstrologerId.set(review.astrologerId, [review])
        }
    }

    const data = astrologers.map(astrologer => {
        const connectionReqeustsPerAstrloger = connectionRequestGroupByAstrologerId.get(astrologer.id) ?? [];
        const reviewsNotHiddenPerAstrloger = reviewsGroupByAstrologerId.get(astrologer.id)?.filter(it => !it.isHidden) ?? [];
        const totalEarningsPaisa = (() => {
            let sum = 0;
            connectionReqeustsPerAstrloger.filter(it => it.status === 'COMPLETED').forEach(it => {
                sum += it.amountPaisa
            })
            return sum;
        })();
        const avgRating = (()=> {
            if (!reviewsNotHiddenPerAstrloger?.length){
                return null
            }
            let reviewSum = 0;
            reviewsNotHiddenPerAstrloger.forEach(it => {
                reviewSum += it.rating
            })
            return Number(reviewSum / reviewsNotHiddenPerAstrloger.length).toFixed(1);
        })()
        const distinctUsers = new Set(connectionReqeustsPerAstrloger.map(it => it.userId));
        return {
            astrologerId: astrologer.id,
            name: astrologer.name,
            totalRequests: connectionReqeustsPerAstrloger.length,
            completedRequests: connectionReqeustsPerAstrloger.filter(it => it.status === 'COMPLETED').length,
            totalEarningsPaisa,
            displayEarnings: '',
            avgRating: avgRating,
            distinctUserCount: distinctUsers.size
        }
    })
    return data;
}

console.log(getAstrologerStats())

// --- your code here ---

module.exports = { users, astrologers, connectionRequests, walletTransactions, reviews, blocks, toRupees };
