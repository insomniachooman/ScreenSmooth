import { applyPrototypeMixin } from './recorder-mixin-utils.js';
import { RecorderZoomMethodsPart1 } from './recorder-zoom-methods-part1.js';
import { RecorderZoomMethodsPart2 } from './recorder-zoom-methods-part2.js';
import { RecorderZoomMethodsPart3 } from './recorder-zoom-methods-part3.js';
import { RecorderZoomMethodsPart4 } from './recorder-zoom-methods-part4.js';
import { RecorderZoomMethodsPart5 } from './recorder-zoom-methods-part5.js';

class RecorderZoomMethods {}

applyPrototypeMixin(RecorderZoomMethods, RecorderZoomMethodsPart1);
applyPrototypeMixin(RecorderZoomMethods, RecorderZoomMethodsPart2);
applyPrototypeMixin(RecorderZoomMethods, RecorderZoomMethodsPart3);
applyPrototypeMixin(RecorderZoomMethods, RecorderZoomMethodsPart4);
applyPrototypeMixin(RecorderZoomMethods, RecorderZoomMethodsPart5);

export { RecorderZoomMethods };
