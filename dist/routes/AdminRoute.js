"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoute = void 0;
var express_1 = __importDefault(require("express"));
var AdminController_1 = require("../controllers/AdminController");
var router = express_1.default.Router();
exports.AdminRoute = router;
router.post('/vandor', AdminController_1.CreateVandor);
router.get("/vandors", AdminController_1.GetVanndors);
router.get('/vandor/:id', AdminController_1.GetVandorByID);
//# sourceMappingURL=AdminRoute.js.map