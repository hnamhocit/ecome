// Common/Extensions/ResultExtensions.cs

using Ecome.Api.Common.Results;
using Microsoft.AspNetCore.Mvc;

namespace Ecome.Api.Common.Extensions;

public static class ResultExtensions
{
    public static ActionResult ToActionResult<T>(this Result<T> result, ControllerBase controller)
    {
        return result.ToActionResult(controller, val => val);
    }

    public static ActionResult ToActionResult<T, TOut>(
        this Result<T> result,
        ControllerBase controller,
        Func<T, TOut> onSuccess)
    {
        if (result.Error is null)
            return controller.Ok(onSuccess(result.Value!));

        var body = new { message = result.Error.Message };
        return result.Error.Type switch
        {
            ErrorType.Unauthorized => controller.Unauthorized(body),
            ErrorType.Forbidden => controller.StatusCode(403, body),
            ErrorType.NotFound => controller.NotFound(body),
            ErrorType.Conflict => controller.Conflict(body),
            _ => controller.BadRequest(body)
        };
    }
}