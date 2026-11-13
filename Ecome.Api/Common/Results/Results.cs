namespace Ecome.Api.Common.Results;

public enum ErrorType
{
    BadRequest,
    Unauthorized,
    Forbidden,
    NotFound,
    Conflict
}

public record Error(ErrorType Type, string Message)
{
    public static Error BadRequest(string msg)
    {
        return new Error(ErrorType.BadRequest, msg);
    }

    public static Error Unauthorized(string msg)
    {
        return new Error(ErrorType.Unauthorized, msg);
    }

    public static Error Forbidden(string msg)
    {
        return new Error(ErrorType.Forbidden, msg);
    }

    public static Error NotFound(string msg)
    {
        return new Error(ErrorType.NotFound, msg);
    }

    public static Error Conflict(string msg)
    {
        return new Error(ErrorType.Conflict, msg);
    }
}

public class Result<T>
{
    private Result(T value)
    {
        Value = value;
    }

    private Result(Error error)
    {
        Error = error;
    }

    public T? Value { get; }
    public Error? Error { get; }

    // Ép kiểu ngầm định: return thẳng value hoặc Error đều được
    public static implicit operator Result<T>(T value)
    {
        return new Result<T>(value);
    }

    public static implicit operator Result<T>(Error error)
    {
        return new Result<T>(error);
    }
}