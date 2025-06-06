"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockDatabase = exports.mockSubjects = void 0;
// Mock data
exports.mockSubjects = [
    {
        id: 1,
        subjectCode: 'SE101',
        name: 'Introduction to Software Engineering',
        credits: 3,
        description: 'Basic concepts of software engineering',
        prerequisiteSubjects: [],
        type: 'Required',
        department: 'Computer Science',
        lecturer: 'Dr. Smith',
        schedule: {
            day: 'Monday',
            session: 'Morning',
            fromTo: '8:00-11:00',
            room: 'A101'
        },
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 2,
        subjectCode: 'SE102',
        name: 'Object-Oriented Programming',
        credits: 4,
        description: 'Advanced OOP concepts',
        prerequisiteSubjects: ['SE101'],
        type: 'Required',
        department: 'Computer Science',
        lecturer: 'Dr. Johnson',
        schedule: {
            day: 'Tuesday',
            session: 'Afternoon',
            fromTo: '13:00-16:00',
            room: 'B202'
        },
        createdAt: new Date(),
        updatedAt: new Date()
    }
];
// Mock Database class
var MockDatabase = /** @class */ (function () {
    function MockDatabase() {
    }
    MockDatabase.query = function (query, params) {
        return __awaiter(this, void 0, void 0, function () {
            var id_1, newSubject, id_2, index, id_3;
            return __generator(this, function (_a) {
                if (!params)
                    return [2 /*return*/, []];
                if (query.includes('SELECT * FROM subjects')) {
                    return [2 /*return*/, this.subjects];
                }
                if (query.includes('WHERE id =')) {
                    id_1 = params[0];
                    return [2 /*return*/, this.subjects.filter(function (s) { return s.id === id_1; })];
                }
                if (query.includes('INSERT INTO subjects')) {
                    newSubject = __assign(__assign({ id: this.subjects.length + 1 }, params[0]), { createdAt: new Date(), updatedAt: new Date() });
                    this.subjects.push(newSubject);
                    return [2 /*return*/, [newSubject]];
                }
                if (query.includes('UPDATE subjects')) {
                    id_2 = params[7];
                    index = this.subjects.findIndex(function (s) { return s.id === id_2; });
                    if (index !== -1) {
                        this.subjects[index] = __assign(__assign(__assign({}, this.subjects[index]), params[0]), { updatedAt: new Date() });
                        return [2 /*return*/, [this.subjects[index]]];
                    }
                    return [2 /*return*/, []];
                }
                if (query.includes('DELETE FROM subjects')) {
                    id_3 = params[0];
                    this.subjects = this.subjects.filter(function (s) { return s.id !== id_3; });
                    return [2 /*return*/, []];
                }
                return [2 /*return*/, []];
            });
        });
    };
    MockDatabase.subjects = __spreadArray([], exports.mockSubjects, true);
    return MockDatabase;
}());
exports.MockDatabase = MockDatabase;
