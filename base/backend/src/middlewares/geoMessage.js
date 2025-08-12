import geoip from "geoip-lite";
import requestIp from "request-ip";

export function geoMessage(req, res, next) {
  try {
    const clientIp = requestIp.getClientIp(req) || req.ip || "";
    const lookup = geoip.lookup(clientIp);

    // For now, the message is static per requirements
    const deliveryMessage = "Chegará em até 14 dias";

    res.locals.geo = {
      ip: clientIp,
      geo: lookup || null,
      deliveryMessage,
    };

    next();
  } catch (err) {
    next(err);
  }
}