import { Router } from "express";
import { Request, Response } from "express";
import { body, param } from "express-validator";
import { validateDto } from "../middleware/dto-validation.middleware";
import SportsEventService from "../services/sports-event.service";
import { NotFoundError } from "../errors/http-errors";
import { authMiddleware } from "../middleware/auth.middleware";
import { CreateBetRequestDto } from "../dto/sports-event/create-bet-request.dto";
import { CreateBetResponseDto } from "../dto/sports-event/create-bet-response.dto";
import { SportsEventResponseDto } from "../dto/sports-event/sports-event-response.dto";
import { CreateSportsEventRequestDto } from "../dto/sports-event/create-sports-event-request.dto";
import { UpdateSportsEventRequestDto } from "../dto/sports-event/update-sports-event-request.dto";

const router = Router();
router.use(authMiddleware);

router.get("/", async (_: Request, res: Response) => {
  const events = await SportsEventService.findAllEvents();

  res.status(200).json({
    events: events.map((event) => ({
      event_id: event.event_id,
      event_name: event.event_name,
      odds: event.odds,
      created_at: event.created_at,
      updated_at: event.updated_at,
    })),
  });
});

router.get("/bets", async (req: Request, res: Response) => {
  console.log(req.user!.id);

  const bets = await SportsEventService.findBetsByUserId(
    parseInt(req.user!.id)
  );

  res.status(200).json({
    bets: bets.map((bet) => ({
      event_name: bet.event_name,
      bet_id: bet.bet_id,
      event_id: bet.event_id,
      bet_amount: bet.bet_amount,
      odds: bet.odds,
      created_at: bet.created_at,
    })),
  });
});

router.get(
  "/:event_id",
  param("event_id").isInt(),
  validateDto,
  async (
    req: Request<{ event_id: string }>,
    res: Response<SportsEventResponseDto>
  ) => {
    const eventId = parseInt(req.params.event_id);
    const event = await SportsEventService.findEventById(eventId);

    if (!event) {
      throw new NotFoundError("Event not found");
    }

    res.status(200).json({
      event_id: event.event_id,
      event_name: event.event_name,
      odds: event.odds,
      created_at: event.created_at,
      updated_at: event.updated_at,
    });
  }
);

router.post(
  "/",
  body("event_name").isString().isLength({ min: 1, max: 255 }),
  body("odds")
    .isString()
    .matches(/^\d+(\.\d{1,2})?$/),
  validateDto,
  async (req: Request<{}, {}, CreateSportsEventRequestDto>, res: Response) => {
    const { event_name, odds } = req.body;

    const event = await SportsEventService.createEvent({
      event_name,
      odds,
    });

    res.status(201).json({
      event_id: event.event_id,
      event_name: event.event_name,
      odds: event.odds,
      created_at: event.created_at,
      updated_at: event.updated_at,
    });
  }
);

router.put(
  "/:event_id",
  param("event_id").isInt(),
  body("event_name").isString().isLength({ min: 1, max: 255 }),
  body("odds")
    .isString()
    .matches(/^\d+(\.\d{1,2})?$/),
  validateDto,
  async (
    req: Request<{ event_id: string }, {}, UpdateSportsEventRequestDto>,
    res: Response
  ) => {
    const { event_name, odds } = req.body;
    const event_id = parseInt(req.params.event_id);

    const event = await SportsEventService.updateEvent({
      event_id: event_id,
      event_name,
      odds,
    });

    res.status(200).json({
      event_id: event.event_id,
      event_name: event.event_name,
      odds: event.odds,
      created_at: event.created_at,
      updated_at: event.updated_at,
    });
  }
);

router.delete(
  "/:event_id",
  param("event_id").isInt(),
  validateDto,
  async (req: Request<{ event_id: string }>, res: Response) => {
    const event_id = parseInt(req.params.event_id);
    const event = await SportsEventService.deleteEvent(event_id);

    res.status(200).json({
      event_id: event.event_id,
      event_name: event.event_name,
      odds: event.odds,
      created_at: event.created_at,
      updated_at: event.updated_at,
    });
  }
);

router.post(
  "/:event_id/bets",
  param("event_id").isInt(),
  body("bet_amount")
    .isString()
    .matches(/^\d+(\.\d{1,2})?$/),
  validateDto,
  async (
    req: Request<{ event_id: string }, {}, CreateBetRequestDto>,
    res: Response<CreateBetResponseDto>
  ) => {
    const { bet_amount } = req.body;
    const eventId = parseInt(req.params.event_id);

    const bet = await SportsEventService.createBet({
      bet_amount,
      sports_event_id: eventId,
      user_id: parseInt(req.user!.id),
    });

    res.status(201).json({
      bet_id: bet.bet_id,
      event_id: bet.event_id,
      bet_amount: bet.bet_amount,
      odds: bet.odds,
      created_at: bet.created_at,
    });
  }
);

export default router;
