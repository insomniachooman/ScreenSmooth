import { applyPrototypeMixin } from './recorder-mixin-utils.js';
import { RecorderAdvancedMethodsPart1 } from './recorder-advanced-methods-part1.js';
import { RecorderAdvancedMethodsPart2 } from './recorder-advanced-methods-part2.js';
import { RecorderAdvancedMethodsPart3 } from './recorder-advanced-methods-part3.js';
import { RecorderAdvancedMethodsPart4 } from './recorder-advanced-methods-part4.js';

class RecorderAdvancedMethods {}

applyPrototypeMixin(RecorderAdvancedMethods, RecorderAdvancedMethodsPart1);
applyPrototypeMixin(RecorderAdvancedMethods, RecorderAdvancedMethodsPart2);
applyPrototypeMixin(RecorderAdvancedMethods, RecorderAdvancedMethodsPart3);
applyPrototypeMixin(RecorderAdvancedMethods, RecorderAdvancedMethodsPart4);

export { RecorderAdvancedMethods };
