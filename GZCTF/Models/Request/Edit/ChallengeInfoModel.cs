﻿using System.ComponentModel.DataAnnotations;

namespace CTFServer.Models.Request.Edit;

public class ChallengeInfoModel
{
    /// <summary>
    /// 题目Id
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// 题目名称
    /// </summary>
    [Required(ErrorMessage = "标题是必需的")]
    [MinLength(1, ErrorMessage = "标题过短")]
    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// 题目标签
    /// </summary>
    public ChallengeTag Tag { get; set; } = ChallengeTag.Misc;

    /// <summary>
    /// 题目类型
    /// </summary>
    public ChallengeType Type { get; set; } = ChallengeType.StaticAttachment;

    public static ChallengeInfoModel FromChallenge(Challenge challenge)
        => new()
        {
            Id = challenge.Id,
            Title = challenge.Title,
            Tag = challenge.Tag,
            Type = challenge.Type,
        };
}