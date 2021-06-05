import BullBoard from "bull-board";
import Queue from "../../../../lib/Queue";

BullBoard.setQueues(Queue.queues.map((queue) => queue.bull));

export default BullBoard.UI;
