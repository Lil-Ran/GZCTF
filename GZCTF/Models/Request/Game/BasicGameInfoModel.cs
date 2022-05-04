﻿using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace CTFServer.Models.Request.Game;

public class BasicGameInfoModel
{
    [Key]
    public int Id { get; set; }

    /// <summary>
    /// 比赛标题
    /// </summary>
    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// 比赛描述
    /// </summary>
    public string Summary { get; set; } = string.Empty;

    /// <summary>
    /// 队员数量限制
    /// </summary>
    [JsonPropertyName("limit")]
    public int TeamMemberLimitCount { get; set; } = 0;

    /// <summary>
    /// 开始时间
    /// </summary>
    [JsonPropertyName("start")]
    public DateTimeOffset StartTimeUTC { get; set; } = DateTimeOffset.FromUnixTimeSeconds(0);

    /// <summary>
    /// 结束时间
    /// </summary>
    [JsonPropertyName("end")]
    public DateTimeOffset EndTimeUTC { get; set; } = DateTimeOffset.FromUnixTimeSeconds(0);

    public static BasicGameInfoModel FromGame(Models.Game game)
        => new()
        {
            Id = game.Id,
            Title = game.Title,
            Summary = game.Summary,
            StartTimeUTC = game.StartTimeUTC,
            EndTimeUTC = game.EndTimeUTC,
            TeamMemberLimitCount = game.TeamMemberCountLimit
        };
}