export const cmdI18n = [
  {
    id: 'akinator',
    name: {
      vi: 'akinator'
    },
    description: {
      vi: 'Nghĩ về một nhân vật và để Akinator đoán xem bạn đang nghĩ về ai.'
    },
    options: [
      {
        id: 'language',
        name: {
          vi: 'ngôn-ngữ'
        },
        description: {
          vi: 'Ngôn ngữ để khởi tạo trò chơi. Mặc định là ngôn ngữ của bạn.'
        }
      },
      {
        id: 'childmode',
        name: {
          vi: 'chế-độ-trẻ-em'
        },
        description: {
          vi: 'Khi bật, Akinator sẽ không hỏi về những nội dung nhạy cảm.'
        }
      }
    ]
  },
  {
    id: 'characterai',
    name: {
      vi: 'characterai'
    },
    description: {
      vi: 'Tuỳ chỉnh nhân vật AI của bạn.'
    },
    options: [
      {
        id: 'help',
        name: {
          vi: 'hướng-dẫn'
        },
        description: {
          vi: 'Hướng dẫn sử dụng CharacterAI trong máy chủ của bạn.'
        }
      },
      {
        id: 'summon',
        name: {
          vi: 'mời'
        },
        description: {
          vi: 'Mời nhân vật AI vào kênh chat của bạn.'
        },
        options: [
          {
            id: 'character',
            name: {
              vi: 'nhân-vật'
            },
            description: {
              vi: 'Nhân vật AI bạn muốn mời.'
            }
          }
        ]
      },
      {
        id: 'featuredchars',
        name: {
          vi: 'nhân-vật-nổi-bật'
        },
        description: {
          vi: 'Xem thông tin một số nhân vật AI nổi bật.'
        }
      }
    ]
  },
  {
    id: 'imagegenerate',
    name: {
      vi: 'tạo-ảnh-ai'
    },
    description: {
      vi: 'Tạo ảnh AI từ văn bản.'
    },
    options: [
      {
        id: 'prompt',
        name: {
          vi: 'cú-pháp'
        },
        description: {
          vi: 'Cú pháp để tạo ảnh AI.'
        }
      }
    ]
  },
  {
    id: 'promptoptimize',
    name: {
      vi: 'tối-ưu-cú-pháp'
    },
    description: {
      vi: 'Tối ưu hóa cú pháp để tạo ảnh AI.'
    },
    options: [
      {
        id: 'prompt',
        name: {
          vi: 'cú-pháp'
        },
        description: {
          vi: 'Cú pháp cần tối ưu.'
        }
      }
    ]
  },
  {
    id: 'Get Emojis',
    name: {
      vi: 'Tải Biểu Cảm'
    }
  },
  {
    id: 'Get User',
    name: {
      vi: 'Thông Tin Người Dùng'
    }
  },
  {
    id: 'Translate',
    name: {
      vi: 'Dịch Văn Bản'
    }
  },
  {
    id: 'daily',
    name: {
      vi: 'điểm-danh'
    },
    description: {
      vi: 'Nhận quà điểm danh hàng ngày.'
    }
  },
  {
    id: 'get-zodiac',
    name: {
      vi: 'xem-con-giáp'
    },
    description: {
      vi: 'Xem thông tin về con giáp trong năm.'
    },
    options: [
      {
        id: 'year',
        name: {
          vi: 'năm'
        },
        description: {
          vi: 'Năm bạn muốn xem thông tin.'
        }
      }
    ]
  },
  {
    id: 'year-progress',
    name: {
      vi: 'sắp-hết-năm-chưa'
    },
    description: {
      vi: 'Xem năm nay đã trôi qua bao nhiêu ngày.'
    }
  },
  {
    id: '8ball',
    name: {
      vi: 'bói-bóng'
    },
    description: {
      vi: 'Bói bóng ngóng tương lai 🤔'
    },
    options: [
      {
        id: 'question',
        name: {
          vi: 'hỏi-thầy'
        },
        description: {
          vi: 'Con muốn bói gì nào.'
        }
      }
    ]
  },
  {
    id: 'afk',
    name: {
      vi: 'afk'
    },
    description: {
      vi: 'Đặt trạng thái AFK, tự động trả lời khi bạn không ở đây.'
    },
    options: [
      {
        id: 'message',
        name: {
          vi: 'tin-nhắn-trả-lời'
        },
        description: {
          vi: 'Tin nhắn trả lời khi có người đề cập đến (ping) bạn.'
        }
      },
      {
        id: 'global',
        name: {
          vi: 'toàn-discord'
        },
        description: {
          vi: 'Đặt trạng thái AFK toàn Discord (Chỉ áp dụng với máy chủ có Bot No Name).'
        }
      }
    ]
  },
  {
    id: 'ascii',
    name: {
      vi: 'ascii'
    },
    description: {
      vi: 'Chuyển văn bản sang tranh ASCII.'
    },
    options: [
      {
        id: 'getfonts',
        name: {
          vi: 'danh-sách-kiểu-chữ'
        },
        description: {
          vi: 'Lấy danh sách kiểu chữ ASCII.'
        }
      },
      {
        id: 'execute',
        name: {
          vi: 'chuyển-đổi'
        },
        description: {
          vi: 'Chuyển văn bản thành tranh ASCII.'
        },
        options: [
          {
            id: 'text',
            name: {
              vi: 'nội-dung'
            },
            description: {
              vi: 'Văn bản cần chuyển đổi.'
            }
          },
          {
            id: 'font',
            name: {
              vi: 'kiểu-chữ'
            },
            description: {
              vi: 'Kiểu chữ ASCII.'
            }
          },
          {
            id: 'width',
            name: {
              vi: 'chiều-rộng'
            },
            description: {
              vi: 'Chiều rộng của tranh ASCII.'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'captcha',
    name: {
      vi: 'captcha'
    },
    description: {
      vi: 'Tạo ảnh captcha để troll bạn bè.'
    },
    options: [
      {
        id: 'user',
        name: {
          vi: 'người-dùng'
        },
        description: {
          vi: 'Người dùng để gắn ảnh captcha.'
        }
      }
    ]
  },
  {
    id: 'catsay',
    name: {
      vi: 'mèo-nói-tiếng-người'
    },
    description: {
      vi: 'Mèo nói tiếng người.'
    },
    options: [
      {
        id: 'message',
        name: {
          vi: 'thông-điệp'
        },
        description: {
          vi: '😾 mài tính bắt kao nói gì hả???'
        }
      }
    ]
  },
  {
    id: 'clyde',
    name: {
      vi: 'clyde'
    },
    description: {
      vi: 'Gọi admin Discord ra nói chuyện'
    },
    options: [
      {
        id: 'message',
        name: {
          vi: 'thông-điệp'
        },
        description: {
          vi: 'Nói gì với admin Discord?'
        }
      }
    ]
  },
  {
    id: 'giveaway',
    name: {
      vi: 'giveaway'
    },
    description: {
      vi: 'Tạo Giveaway trong máy chủ của bạn.'
    },
    options: [
      {
        id: 'start',
        name: {
          vi: 'bắt-đầu'
        },
        description: {
          vi: 'Bắt đầu một sự kiện phát quà 🥳.'
        },
        options: [
          {
            id: 'prize',
            name: {
              vi: 'phần-thưởng'
            },
            description: {
              vi: 'Quà cho sự kiện này.'
            }
          },
          {
            id: 'channel',
            name: {
              vi: 'kênh'
            },
            description: {
              vi: 'Kênh để tạo sự kiện phát quà.'
            }
          }
        ]
      },
      {
        id: 'pause',
        name: {
          vi: 'tạm-dừng'
        },
        description: {
          vi: '⏸️ Tạm dừng sự kiện phát quà.'
        },
        options: [
          {
            id: 'giveaway_id',
            name: {
              vi: 'giveaway_id'
            },
            description: {
              vi: 'ID tin nhắn có sự kiện phát quà.'
            }
          }
        ]
      },
      {
        id: 'resume',
        name: {
          vi: 'tiếp-tục'
        },
        description: {
          vi: '⏯️ Tiếp tục sự kiện phát quà.'
        },
        options: [
          {
            id: 'giveaway_id',
            name: {
              vi: 'giveaway_id'
            },
            description: {
              vi: 'ID tin nhắn có sự kiện phát quà.'
            }
          }
        ]
      },
      {
        id: 'end',
        name: {
          vi: 'kết-thúc'
        },
        description: {
          vi: '🏁 Kết thúc sự kiện phát quà.'
        },
        options: [
          {
            id: 'giveaway_id',
            name: {
              vi: 'giveaway_id'
            },
            description: {
              vi: 'ID tin nhắn có sự kiện phát quà.'
            }
          }
        ]
      },
      {
        id: 'reroll',
        name: {
          vi: 'reroll'
        },
        description: {
          vi: '🎲 Chọn lại người chiến thắng.'
        },
        options: [
          {
            id: 'giveaway_id',
            name: {
              vi: 'giveaway_id'
            },
            description: {
              vi: 'ID tin nhắn có sự kiện phát quà.'
            }
          }
        ]
      },
      {
        id: 'list',
        name: {
          vi: 'danh-sách'
        },
        description: {
          vi: '📜 Danh sách sự kiện phát quà trong máy chủ của bạn.'
        },
        options: [
          {
            id: 'type',
            name: {
              vi: 'loại'
            },
            description: {
              vi: 'Loại sự kiện phát quà.'
            }
          }
        ]
      },
      {
        id: 'edit',
        name: {
          vi: 'chỉnh-sửa'
        },
        description: {
          vi: '🔧 Chỉnh sửa sự kiện phát quà.'
        },
        options: [
          {
            id: 'giveaway_id',
            name: {
              vi: 'giveaway_id'
            },
            description: {
              vi: 'ID tin nhắn có sự kiện phát quà.'
            }
          },
          {
            id: 'new_prize',
            name: {
              vi: 'phần-thưởng'
            },
            description: {
              vi: 'Quà cho sự kiện này.'
            }
          },
          {
            id: 'add_duration',
            name: {
              vi: 'thời-gian'
            },
            description: {
              vi: 'Thêm thời gian cho sự kiện này.'
            }
          },
          {
            id: 'new_winners',
            name: {
              vi: 'số-người-thắng-giải'
            },
            description: {
              vi: 'Số người chiến thắng sự kiện.'
            }
          }
        ]
      },
      {
        id: 'delete',
        name: {
          vi: 'xóa'
        },
        description: {
          vi: '🗑️ Xóa sự kiện mà không trao thưởng cho bất cứ ai.'
        },
        options: [
          {
            id: 'giveaway_id',
            name: {
              vi: 'giveaway_id'
            },
            description: {
              vi: 'ID tin nhắn có sự kiện phát quà.'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'bugreport',
    name: {
      vi: 'báo-lỗi'
    },
    description: {
      vi: 'Báo lỗi cho nhà phát triển.'
    }
  },
  {
    id: 'help',
    name: {
      vi: 'trợ-giúp'
    },
    description: {
      vi: 'Nhận trợ giúp với các lệnh của bot'
    }
  },
  {
    id: 'banlist',
    name: {
      vi: 'danh-sách-cấm'
    },
    description: {
      vi: 'Hiển thị danh sách người dùng bị cấm khỏi máy chủ của bạn.'
    }
  },
  {
    id: 'install-automod',
    name: {
      vi: 'cài-đặt-tự-động-kiểm-duyệt'
    },
    description: {
      vi: 'Cài đặt tự động kiểm duyệt cho máy chủ của bạn.'
    },
    options: [
      {
        id: 'preset',
        name: {
          vi: 'hồ-sơ'
        },
        description: {
          vi: 'Các tuỳ chọn được thiết lập sẵn'
        }
      }
    ]
  },
  {
    id: 'ban',
    name: {
      vi: 'cấm-người-dùng'
    },
    description: {
      vi: 'Cấm người dùng khỏi máy chủ của bạn.'
    },
    options: [
      {
        id: 'user',
        name: {
          vi: 'người-dùng'
        },
        description: {
          vi: 'Người dùng cần cấm.'
        },
        type: 6,
        required: true
      },
      {
        id: 'reason',
        name: {
          vi: 'lý-do'
        },
        description: {
          vi: 'Lý do cấm người dùng.'
        }
      }
    ]
  },
  {
    id: 'delete',
    name: {
      vi: 'xóa-tin-nhắn'
    },
    description: {
      vi: 'Xóa lượng lớn tin nhắn trong kênh chat.'
    },
    options: [
      {
        id: 'amount',
        name: {
          vi: 'số-lượng'
        },
        description: {
          vi: 'Số lượng tin nhắn cần xóa.'
        }
      }
    ]
  },
  {
    id: 'kick',
    name: {
      vi: 'xoá-người-dùng'
    },
    description: {
      vi: 'Xoá một người-dùng khỏi máy chủ của bạn.'
    },
    options: [
      {
        id: 'user',
        name: {
          vi: 'người-dùng'
        },
        description: {
          vi: 'Người dùng cần xoá.'
        }
      },
      {
        id: 'reason',
        name: {
          vi: 'lý-do'
        },
        description: {
          vi: 'Lý do xoá người dùng.'
        }
      }
    ]
  },
  {
    id: 'lock',
    name: {
      vi: 'khóa-kênh'
    },
    description: {
      vi: '🔒 Khoá kênh và ngăn tất cả thành viên tham gia trò chuyện trong kênh đó.'
    },
    options: [
      {
        id: 'channel',
        name: {
          vi: 'kênh'
        },
        description: {
          vi: 'Kênh cần khoá.'
        }
      },
      {
        id: 'reason',
        name: {
          vi: 'lý-do'
        },
        description: {
          vi: 'Lý do khoá kênh.'
        }
      }
    ]
  },
  {
    id: 'role',
    name: {
      vi: 'vai-trò'
    },
    description: {
      vi: 'Tạo, chỉnh sửa hoặc xóa vai trò trong máy chủ.'
    },
    options: [
      {
        id: 'add',
        name: {
          vi: 'thêm'
        },
        description: {
          vi: 'Thêm vai trò cho người dùng.'
        },
        options: [
          {
            id: 'user',
            name: {
              vi: 'người-dùng'
            },
            description: {
              vi: 'Người dùng cần thêm vai trò.'
            }
          },
          {
            id: 'role',
            name: {
              vi: 'vai-trò'
            },
            description: {
              vi: 'Vai trò cần thêm.'
            }
          },
          {
            id: 'reason',
            name: {
              vi: 'lý-do'
            },
            description: {
              vi: 'Lý do thêm vai trò.'
            }
          }
        ]
      },
      {
        id: 'remove',
        name: {
          vi: 'xoá'
        },
        description: {
          vi: 'Xoá vai trò của người dùng.'
        },
        options: [
          {
            id: 'user',
            name: {
              vi: 'người-dùng'
            },
            description: {
              vi: 'Người dùng cần xoá vai trò.'
            }
          },
          {
            id: 'role',
            name: {
              vi: 'vai-trò'
            },
            description: {
              vi: 'Vai trò cần xoá.'
            }
          },
          {
            id: 'reason',
            name: {
              vi: 'lý-do'
            },
            description: {
              vi: 'Lý do xoá vai trò.'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'timeout',
    name: {
      vi: 'hạn-chế'
    },
    description: {
      vi: 'Hạn chế người dùng tương tác với cộng đồng trong một thời gian nhất định.'
    },
    options: [
      {
        id: 'user',
        name: {
          vi: 'người-dùng'
        },
        description: {
          vi: 'Người dùng cần hạn chế.'
        }
      },
      {
        id: 'time',
        name: {
          vi: 'thời-gian'
        },
        description: {
          vi: 'Thời gian hạn chế.'
        }
      },
      {
        id: 'reason',
        name: {
          vi: 'lý-do'
        },
        description: {
          vi: 'Lý do hạn chế.'
        }
      }
    ]
  },
  {
    id: 'unban',
    name: {
      vi: 'bỏ-cấm'
    },
    description: {
      vi: 'Bỏ cấm người dùng khỏi máy chủ của bạn.'
    },
    options: [
      {
        id: 'user',
        name: {
          vi: 'người-dùng'
        },
        description: {
          vi: 'Người dùng cần bỏ cấm.'
        }
      },
      {
        id: 'reason',
        name: {
          vi: 'lý-do'
        },
        description: {
          vi: 'Lý do bỏ cấm người dùng.'
        }
      }
    ]
  },
  {
    id: 'unlock',
    name: {
      vi: 'mở-kênh'
    },
    description: {
      vi: '🔓 Mở khoá kênh và cho phép tất cả thành viên tham gia trò chuyện trong kênh đó.'
    },
    options: [
      {
        id: 'channel',
        name: {
          vi: 'kênh'
        },
        description: {
          vi: 'Kênh cần mở khoá.'
        }
      },
      {
        id: 'reason',
        name: {
          vi: 'lý-do'
        },
        description: {
          vi: 'Lý do mở khoá kênh.'
        }
      }
    ]
  },
  {
    id: 'voice',
    name: {
      vi: 'quản-lý-thoại'
    },
    description: {
      vi: 'Kiểm soát ai có thể tham gia các kênh thoại, và thực hiện các nhiệm vụ quản lý khác.'
    },
    options: [
      {
        id: 'mute',
        name: {
          vi: 'tắt-mic'
        },
        description: {
          vi: 'Tắt mic người dùng trong kênh thoại.'
        },
        options: [
          {
            id: 'user',
            name: {
              vi: 'người-dùng'
            },
            description: {
              vi: 'Người dùng cần tắt mic.'
            }
          },
          {
            id: 'reason',
            name: {
              vi: 'lý-do'
            },
            description: {
              vi: 'Lý do tắt mic.'
            }
          }
        ]
      },
      {
        id: 'unmute',
        name: {
          vi: 'bật-mic'
        },
        description: {
          vi: 'Bật mic người dùng trong kênh thoại.'
        },
        options: [
          {
            id: 'user',
            name: {
              vi: 'người-dùng'
            },
            description: {
              vi: 'Người dùng cần bật mic.'
            }
          },
          {
            id: 'reason',
            name: {
              vi: 'lý-do'
            },
            description: {
              vi: 'Lý do bật mic.'
            }
          }
        ]
      },
      {
        id: 'deafen',
        name: {
          vi: 'tắt-tiếng'
        },
        description: {
          vi: 'Tắt tiếng người dùng trong kênh thoại.'
        },
        options: [
          {
            id: 'user',
            name: {
              vi: 'người-dùng'
            },
            description: {
              vi: 'Người dùng cần tắt tiếng.'
            }
          },
          {
            id: 'reason',
            name: {
              vi: 'lý-do'
            },
            description: {
              vi: 'Lý do tắt tiếng.'
            }
          }
        ]
      },
      {
        id: 'undeafen',
        name: {
          vi: 'bật-tiếng'
        },
        description: {
          vi: 'Bật tiếng người dùng trong kênh thoại.'
        },
        options: [
          {
            id: 'user',
            name: {
              vi: 'người-dùng'
            },
            description: {
              vi: 'Người dùng cần bật tiếng.'
            }
          },
          {
            id: 'reason',
            name: {
              vi: 'lý-do'
            },
            description: {
              vi: 'Lý do bật tiếng.'
            }
          }
        ]
      },
      {
        id: 'kick',
        name: {
          vi: 'mời-khỏi-kênh'
        },
        description: {
          vi: 'Mời người dùng khỏi kênh thoại.'
        },
        options: [
          {
            id: 'user',
            name: {
              vi: 'người-dùng'
            },
            description: {
              vi: 'Người dùng cần đuổi.'
            }
          },
          {
            id: 'reason',
            name: {
              vi: 'lý-do'
            },
            description: {
              vi: 'Lý do đuổi.'
            }
          }
        ]
      },
      {
        id: 'move',
        name: {
          vi: 'di-chuyển'
        },
        description: {
          vi: 'Di chuyển người dùng đến kênh thoại khác.'
        },
        options: [
          {
            id: 'user',
            name: {
              vi: 'người-dùng'
            },
            description: {
              vi: 'Người dùng cần di chuyển.'
            }
          },
          {
            id: 'channel',
            name: {
              vi: 'kênh'
            },
            description: {
              vi: 'Kênh cần di chuyển đến.'
            }
          },
          {
            id: 'reason',
            name: {
              vi: 'lý-do'
            },
            description: {
              vi: 'Lý do di chuyển.'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'warn',
    name: {
      vi: 'cảnh-cáo'
    },
    description: {
      vi: 'Cảnh cáo người dùng trong máy chủ của bạn.'
    },
    options: [
      {
        id: 'add',
        name: {
          vi: 'thêm'
        },
        description: {
          vi: 'Thêm cảnh cáo một người dùng.'
        },
        options: [
          {
            id: 'user',
            name: {
              vi: 'người-dùng'
            },
            description: {
              vi: 'Người dùng bị cảnh cáo.'
            }
          },
          {
            id: 'reason',
            name: {
              vi: 'lý-do'
            },
            description: {
              vi: 'Lý do cảnh cáo.'
            }
          }
        ]
      },
      {
        id: 'list',
        name: {
          vi: 'danh-sách'
        },
        description: {
          vi: 'Xem danh sách cảnh cáo của người dùng.'
        },
        options: [
          {
            id: 'user',
            name: {
              vi: 'người-dùng'
            },
            description: {
              vi: 'Người dùng cần xem danh sách cảnh cáo.'
            }
          }
        ]
      },
      {
        id: 'remove',
        name: {
          vi: 'xoá'
        },
        description: {
          vi: 'Xoá cảnh cáo của người dùng.'
        },
        options: [
          {
            id: 'user',
            name: {
              vi: 'người-dùng'
            },
            description: {
              vi: 'Người dùng được xoá cảnh cáo.'
            }
          },
          {
            id: 'warnid',
            name: {
              vi: 'id'
            },
            description: {
              vi: 'ID của cảnh cáo cần xoá.'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'lovemeter',
    name: {
      vi: 'đo-lường-tình-yêu'
    },
    description: {
      vi: 'Xem mức độ tình yêu của hai người nào đó ( ͡° ͜ʖ ͡°)'
    },
    options: [
      {
        id: 'mainuser',
        name: {
          vi: 'người-muốn-thử'
        },
        description: {
          vi: 'Người muốn kiểm tra tình yêu, mặc định là bạn.'
        }
      },
      {
        id: 'targetuser',
        name: {
          vi: 'người-bị-thử'
        },
        description: {
          vi: 'Người sẽ bị kiểm tra tình yêu, hoặc là một người ngẫu nhiên 🤔'
        }
      }
    ]
  },
  {
    id: 'meme',
    name: {
      vi: 'meme'
    },
    description: {
      vi: 'Tìm ngẫu nhiên một số meme (ảnh chế)'
    },
    options: [
      {
        id: 'category',
        name: {
          vi: 'thể-loại'
        },
        description: {
          vi: 'Thể loại meme này (chỉ hỗ trợ tiếng anh).'
        }
      }
    ]
  },
  {
    id: 'memecreate',
    name: {
      vi: 'tạo-meme'
    },
    description: {
      vi: 'Tạo ảnh chế (trôn vi-en) từ một mẫu có sẵn.'
    },
    options: [
      {
        id: 'help',
        name: {
          vi: 'hướng-dẫn'
        },
        description: {
          vi: 'Hướng dẫn sử dụng chức năng tạo meme.'
        }
      },
      {
        id: 'execute',
        name: {
          vi: 'tạo'
        },
        description: {
          vi: 'Tạo meme từ một mẫu có sẵn.'
        },
        options: [
          {
            id: 'name',
            name: {
              vi: 'tên-mẫu'
            },
            description: {
              vi: 'Tên mẫu meme.'
            }
          },
          {
            id: 'img1',
            name: {
              vi: 'ảnh-1'
            },
            description: {
              vi: 'Link ảnh 1.'
            }
          },
          {
            id: 'img2',
            name: {
              vi: 'ảnh-2'
            },
            description: {
              vi: 'Link ảnh 2.'
            }
          },
          {
            id: 'img3',
            name: {
              vi: 'ảnh-3'
            },
            description: {
              vi: 'Link ảnh 3.'
            }
          },
          {
            id: 'lvl',
            name: {
              vi: 'mức-độ'
            },
            description: {
              vi: 'Mức độ (dảk) của meme muốn tạo.'
            }
          },
          {
            id: 'text',
            name: {
              vi: 'nội-dung'
            },
            description: {
              vi: 'Nhập chữ cho meme muốn tạo.'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'minecraft-advancement',
    name: {
      vi: 'thành-tựu-minecraft'
    },
    description: {
      vi: 'Tạo ảnh thành tựu Minecraft từ văn bản.'
    },
    options: [
      {
        id: 'text',
        name: {
          vi: 'nội-dung'
        },
        description: {
          vi: 'Nhập nội dung để tạo ảnh thành tựu Minecraft.'
        }
      },
      {
        id: 'object',
        name: {
          vi: 'đối-tượng'
        },
        description: {
          vi: 'Vật dụng bạn muốn hiển thị trên ảnh.'
        }
      }
    ]
  },
  {
    id: 'phub-comment',
    name: {
      vi: 'bình-luận-web-đen'
    },
    description: {
      vi: 'Tạo ảnh như thể bạn vừa bình luận trên web đen  ( ͡° ͜ʖ ͡°)'
    },
    options: [
      {
        id: 'content',
        name: {
          vi: 'nội-dung'
        },
        description: {
          vi: 'Nội dung bình luận.'
        }
      },
      {
        id: 'user',
        name: {
          vi: 'người-dùng'
        },
        description: {
          vi: 'Tên người dùng.'
        }
      },
      {
        id: 'avatar',
        name: {
          vi: 'ảnh-đại-diện'
        },
        description: {
          vi: 'Link ảnh đại diện đứa bạn muốn nhét vào.'
        }
      }
    ]
  },
  {
    id: 'tweet',
    name: {
      vi: 'tweet'
    },
    description: {
      vi: 'Tạo ảnh là một bình luận trên Twitter (X).'
    },
    options: [
      {
        id: 'content',
        name: {
          vi: 'nội-dung'
        },
        description: {
          vi: 'Nội dung bình luận.'
        }
      },
      {
        id: 'user',
        name: {
          vi: 'người-dùng'
        },
        description: {
          vi: 'Tên người dùng.'
        }
      }
    ]
  },
  {
    id: 'youtube-comment',
    name: {
      vi: 'bình-luận-youtube'
    },
    description: {
      vi: 'Tạo ảnh như thể bạn vừa bình luận trên YouTube  ( ͡° ͜ʖ ͡°)'
    },
    options: [
      {
        id: 'content',
        name: {
          vi: 'nội-dung'
        },
        description: {
          vi: 'Nội dung bình luận.'
        }
      },
      {
        id: 'user',
        name: {
          vi: 'người-dùng'
        },
        description: {
          vi: 'Tên người dùng.'
        }
      },
      {
        id: 'avatar',
        name: {
          vi: 'ảnh-đại-diện'
        },
        description: {
          vi: 'Link ảnh đại diện đứa bạn muốn nhét vào.'
        }
      },
      {
        id: 'darkmode',
        name: {
          vi: 'chế-độ-tối'
        },
        description: {
          vi: 'Chế độ tối.'
        }
      }
    ]
  },
  {
    id: 'avatar',
    name: {
      vi: 'ảnh-đại-diện'
    },
    description: {
      vi: 'Tải về ảnh đại diện độ phân giải cao của một người dùng.'
    },
    options: [
      {
        id: 'user',
        name: {
          vi: 'người-dùng'
        },
        description: {
          vi: 'Người dùng muốn xem ảnh đại diện. (Mặc định khi để trống là bản thân)'
        }
      },
      {
        id: 'id',
        name: {
          vi: 'id'
        },
        description: {
          vi: 'Nếu tài khoản đó không có trong máy chủ, bạn có thể dùng ID để thay thế.'
        }
      },
      {
        id: 'size',
        name: {
          vi: 'kích-thước'
        },
        description: {
          vi: 'Kích thước ảnh đại diện.'
        }
      }
    ]
  },
  {
    id: 'dashboard',
    name: {
      vi: 'trang-quản-lý'
    },
    description: {
      vi: 'Mở trang quản lý máy chủ của bạn.'
    }
  },
  {
    id: 'invite',
    name: {
      vi: 'mời-bot'
    },
    description: {
      vi: 'Mời bot No Name vào máy chủ của bạn.'
    }
  },
  {
    id: 'ping',
    name: {
      vi: 'ping'
    },
    description: {
      vi: 'Kiểm tra bot No Name có online hay không.'
    }
  },
  {
    id: 'roleinfo',
    name: {
      vi: 'thông-tin-vai-trò'
    },
    description: {
      vi: 'Xem thông tin của một vai trò trong máy chủ của bạn.'
    },
    options: [
      {
        id: 'role',
        name: {
          vi: 'vai-trò'
        },
        description: {
          vi: 'Vai trò cần xem thông tin.'
        }
      }
    ]
  },
  {
    id: 'channelinfo',
    name: {
      vi: 'thông-tin-kênh'
    },
    description: {
      vi: 'Hiển thị thông tin của một kênh'
    },
    options: [
      {
        id: 'channel',
        name: {
          vi: 'kênh'
        },
        description: {
          vi: 'Kênh để lấy thông tin. (Mặc định: Kênh hiện tại)'
        }
      }
    ]
  },
  {
    id: 'rolelist',
    name: {
      vi: 'danh-sách-vai-trò'
    },
    description: {
      vi: 'Liệt kê tất cả các vai trò trong máy chủ của bạn.'
    }
  },
  {
    id: 'serverinfo',
    name: {
      vi: 'thông-tin-máy-chủ'
    },
    description: {
      vi: 'Hiển thị thông tin của máy chủ của bạn.'
    }
  },
  {
    id: 'userinfo',
    name: {
      vi: 'thông-tin-người-dùng'
    },
    description: {
      vi: 'Hiển thị thông tin của một người dùng.'
    },
    options: [
      {
        id: 'user',
        name: {
          vi: 'người-dùng'
        },
        description: {
          vi: 'Người dùng cần xem thông tin. (Mặc định: Bạn)'
        }
      }
    ]
  },
  {
    id: 'emoji',
    name: {
      vi: 'emoji'
    },
    description: {
      vi: 'Tải về một emoji bất kì với độ phân giải cao.'
    },
    options: [
      {
        id: 'emoji',
        name: {
          vi: 'emoji'
        },
        description: {
          vi: 'Emoji cần tải về.'
        }
      }
    ]
  },
  {
    id: 'feedback',
    name: {
      vi: 'góp-ý'
    },
    description: {
      vi: 'Gửi góp ý về bot No Name.'
    }
  },
  {
    id: 'qrcode',
    name: {
      vi: 'mã-qr'
    },
    description: {
      vi: 'Tạo hoặc quét mã QR qua hình ảnh.'
    },
    options: [
      {
        id: 'generate',
        name: {
          vi: 'tạo'
        },
        description: {
          vi: 'Tạo mã QR từ một nội dung.'
        },
        options: [
          {
            id: 'text',
            name: {
              vi: 'nội-dung'
            },
            description: {
              vi: 'Nội dung cần tạo mã QR.'
            }
          }
        ]
      },
      {
        id: 'scan',
        name: {
          vi: 'quét'
        },
        description: {
          vi: 'Quét mã QR từ hình ảnh.'
        },
        options: [
          {
            id: 'image',
            name: {
              vi: 'hình-ảnh'
            },
            description: {
              vi: 'Hình ảnh chứa mã QR.'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'say',
    name: {
      vi: 'bot-nói'
    },
    description: {
      vi: 'Bắt bot nói một điều gì đó.'
    },
    options: [
      {
        id: 'text',
        name: {
          vi: 'thông-điệp'
        },
        description: {
          vi: 'Nội dung bạn muốn bot nói.'
        }
      }
    ]
  },
  {
    id: 'shortenurl',
    name: {
      vi: 'rút-gọn-url'
    },
    description: {
      vi: 'Rút gọn một liên kết dài thành ngắn.'
    },
    options: [
      {
        id: 'url',
        name: {
          vi: 'liên-kết'
        },
        description: {
          vi: 'Liên kết cần rút gọn.'
        }
      },
      {
        id: 'shorturl',
        name: {
          vi: 'tên'
        },
        description: {
          vi: 'Tên ngắn gọn cho liên kết.'
        }
      }
    ]
  },
  {
    id: 'translate',
    name: {
      vi: 'dịch'
    },
    description: {
      vi: 'Dịch một văn bản từ một ngôn ngữ sang ngôn ngữ khác.'
    },
    options: [
      {
        id: 'text',
        name: {
          vi: 'nội-dung'
        },
        description: {
          vi: 'Nội dung cần dịch.'
        }
      },
      {
        id: 'from',
        name: {
          vi: 'từ'
        },
        description: {
          vi: 'Ngôn ngữ hiện tại của nội dung.'
        }
      },
      {
        id: 'to',
        name: {
          vi: 'đến'
        },
        description: {
          vi: 'Ngôn ngữ bạn muốn dịch đến. (Mặc định: Tiếng Anh)'
        }
      }
    ]
  },
  {
    id: 'ticket',
    name: {
      vi: 'ticket'
    },
    description: {
      vi: 'Quản lí các yêu cầu hỗ trợ.'
    },
    options: [
      {
        id: 'create',
        name: {
          vi: 'tạo'
        },
        description: {
          vi: 'Tạo một yêu cầu hỗ trợ.'
        },
        options: [
          {
            id: 'channel',
            name: {
              vi: 'kênh'
            },
            description: {
              vi: 'Kênh gửi yêu cầu hỗ trợ.'
            }
          }
        ]
      },
      {
        id: 'log',
        name: {
          vi: 'quản-lí-nhật-ký'
        },
        description: {
          vi: 'Quản lí nhật ký yêu cầu hỗ trợ.'
        },
        options: [
          {
            id: 'channel',
            name: {
              vi: 'kênh'
            },
            description: {
              vi: 'Kênh để gửi lịch sử yêu cầu hỗ trợ.'
            }
          }
        ]
      },
      {
        id: 'limit',
        name: {
          vi: 'giới-hạn'
        },
        description: {
          vi: 'Giới hạn số yêu cầu hỗ trợ mà người dùng có thể tạo cùng lúc.'
        },
        options: [
          {
            id: 'amount',
            name: {
              vi: 'số-lượng'
            },
            description: {
              vi: 'Số lượng yêu cầu hỗ trợ tối đa.'
            }
          }
        ]
      },
      {
        id: 'close',
        name: {
          vi: 'đóng'
        },
        description: {
          vi: 'Đóng yêu cầu hỗ trợ. (Chỉ có thể sử dụng trong kênh yêu cầu hỗ trợ)'
        }
      },
      {
        id: 'closeall',
        name: {
          vi: 'đóng-tất-cả'
        },
        description: {
          vi: 'Đóng tất cả yêu cầu hỗ trợ trong máy chủ.'
        }
      },
      {
        id: 'add',
        name: {
          vi: 'thêm'
        },
        description: {
          vi: 'Thêm người dùng hoặc vai trò vào kênh'
        },
        options: [
          {
            id: 'user',
            name: {
              vi: 'người-dùng'
            },
            description: {
              vi: 'Người dùng được thêm.'
            }
          },
          {
            id: 'role',
            name: {
              vi: 'vai-trò'
            },
            description: {
              vi: 'Vai trò được thêm.'
            }
          }
        ]
      },
      {
        id: 'remove',
        name: {
          vi: 'xoá'
        },
        description: {
          vi: 'Xoá người dùng hoặc vai trò khỏi kênh.'
        },
        options: [
          {
            id: 'user',
            name: {
              vi: 'người-dùng'
            },
            description: {
              vi: 'Người dùng bị xoá.'
            }
          },
          {
            id: 'role',
            name: {
              vi: 'vai-trò'
            },
            description: {
              vi: 'Vai trò bị xoá.'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'covid19stats',
    name: {
      vi: 'thống-kê-covid19'
    },
    description: {
      vi: 'Xem thông tin về tình hình dịch COVID-19.'
    },
    options: [
      {
        id: 'area',
        name: {
          vi: 'khu-vực'
        },
        description: {
          vi: 'Khu vực cần xem thông tin.'
        }
      }
    ]
  },
  {
    id: 'dictionary',
    name: {
      vi: 'từ-điển'
    },
    description: {
      vi: 'Tra cứu từ điển.'
    },
    options: [
      {
        id: 'word',
        name: {
          vi: 'từ'
        },
        description: {
          vi: 'Từ cần tra cứu.'
        }
      }
    ]
  },
  {
    id: 'github',
    name: {
      vi: 'github'
    },
    description: {
      vi: 'Tra cứu thông tin Github.'
    },
    options: [
      {
        id: 'user',
        name: {
          vi: 'người-dùng'
        },
        description: {
          vi: 'Tra cứu thông tin người dùng Github.'
        },
        options: [
          {
            id: 'username',
            name: {
              vi: 'tên-người-dùng'
            },
            description: {
              vi: 'Tên người dùng Github.'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'instagram',
    name: {
      vi: 'instagram'
    },
    description: {
      vi: 'Tra cứu thông tin Instagram.'
    },
    options: [
      {
        id: 'username',
        name: {
          vi: 'tên-người-dùng'
        },
        description: {
          vi: 'Tên người dùng Instagram.'
        }
      },
      {
        id: 'token',
        name: {
          vi: 'token'
        },
        description: {
          vi: 'Token trang web Instagram.'
        }
      }
    ]
  },
  {
    id: 'steam',
    name: {
      vi: 'steam'
    },
    description: {
      vi: 'Tra cứu thông tin Steam.'
    },
    options: [
      {
        id: 'product',
        name: {
          vi: 'sản-phẩm'
        },
        description: {
          vi: 'Tra cứu thông tin một tựa game trên Steam.'
        }
      },
      {
        id: 'market',
        name: {
          vi: 'thị-trường'
        },
        description: {
          vi: 'Tra cứu thông tin thị trường Steam.'
        }
      },
      {
        id: 'language',
        name: {
          vi: 'ngôn-ngữ'
        },
        description: {
          vi: 'Ngôn ngữ hiển thị thông tin.'
        }
      }
    ]
  },
  {
    id: 'weather',
    name: {
      vi: 'thời-tiết'
    },
    description: {
      vi: 'Xem dự báo thời tiết.'
    },
    options: [
      {
        id: 'location',
        name: {
          vi: 'khu-vực'
        },
        description: {
          vi: 'Khu vực cần xem dự báo thời tiết.'
        }
      },
      {
        id: 'temperature-unit',
        name: {
          vi: 'đơn-vị'
        },
        description: {
          vi: 'Đơn vị đo lường nhiệt độ.'
        }
      }
    ]
  },
  {
    id: 'wikipedia',
    name: {
      vi: 'wikipedia'
    },
    description: {
      vi: 'Tra cứu thông tin từ Wikipedia.'
    },
    options: [
      {
        id: 'query',
        name: {
          vi: 'từ-khóa'
        },
        description: {
          vi: 'Từ khóa cần tra cứu.'
        }
      }
    ]
  },
  {
    id: 'leaderboard',
    name: {
      vi: 'bảng-xếp-hạng'
    },
    description: {
      vi: 'Xem bảng xếp hạng của máy chủ.'
    }
  },
  {
    id: 'rankcard',
    name: {
      vi: 'thẻ-xếp-hạng'
    },
    description: {
      vi: 'Tạo thẻ xếp hạng của người dùng.'
    },
    options: [
      {
        id: 'user',
        name: {
          vi: 'người-dùng'
        },
        description: {
          vi: 'Người dùng muốn tạo thẻ xếp hạng. [Mặc định: Bạn]'
        }
      }
    ]
  },
  {
    id: 'music',
    name: {
      vi: 'nhạc'
    },
    description: {
      vi: 'Nghe nhạc từ nhiều nền tảng ngay trong máy chủ của bạn.'
    },
    options: [
      {
        id: 'play',
        name: {
          vi: 'phát'
        },
        description: {
          vi: 'Phát một bài hát bất kì'
        },
        options: [
          {
            id: 'name',
            name: {
              vi: 'tên'
            },
            description: {
              vi: 'Tìm kiếm bài hát theo từ khóa hoặc sử dụng URL.'
            }
          }
        ]
      },
      {
        id: 'status',
        name: {
          vi: 'trạng-thái'
        },
        description: {
          vi: 'Xem trạng thái hiện tại của trình phát.'
        }
      },
      {
        id: 'pause',
        name: {
          vi: 'tạm-dừng'
        },
        description: {
          vi: 'Tạm dừng trình phát.'
        }
      },
      {
        id: 'resume',
        name: {
          vi: 'tiếp-tục'
        },
        description: {
          vi: 'Tiếp tục trình phát.'
        }
      },
      {
        id: 'queue',
        name: {
          vi: 'danh-sách'
        },
        description: {
          vi: 'Xem danh sách phát hiện tại.'
        }
      },
      {
        id: 'nowplaying',
        name: {
          vi: 'đang-phát'
        },
        description: {
          vi: 'Xem thông tin về video đang phát.'
        }
      },
      {
        id: 'shuffle',
        name: {
          vi: 'xáo-trộn'
        },
        description: {
          vi: 'Xáo trộn danh sách phát.'
        }
      },
      {
        id: 'skip',
        name: {
          vi: 'bỏ-qua'
        },
        description: {
          vi: 'Bỏ qua video hiện tại.'
        }
      },
      {
        id: 'previous',
        name: {
          vi: 'quay-lại'
        },
        description: {
          vi: 'Phát lại video trước đó.'
        }
      },
      {
        id: 'stop',
        name: {
          vi: 'dừng'
        },
        description: {
          vi: 'Dừng trình phát.'
        }
      },
      {
        id: 'skipto',
        name: {
          vi: 'bỏ-qua-đến'
        },
        description: {
          vi: 'Bỏ qua đến video cụ thể.'
        },
        options: [
          {
            id: 'number',
            name: {
              vi: 'số-thứ-tự'
            },
            description: {
              vi: 'Số thứ tự của video cần bỏ qua.'
            }
          }
        ]
      },
      {
        id: 'seek',
        name: {
          vi: 'tua-đến'
        },
        description: {
          vi: 'Tua video đang phát đến một thời điểm cụ thể.'
        },
        options: [
          {
            id: 'duration',
            name: {
              vi: 'thời-gian'
            },
            description: {
              vi: 'Thời gian cần tua đến. (giây)'
            }
          }
        ]
      },
      {
        id: 'autoplay',
        name: {
          vi: 'tự-động-phát'
        },
        description: {
          vi: 'Bật/tắt chế độ tự động phát các video tương tự.'
        }
      },
      {
        id: 'loop',
        name: {
          vi: 'lặp'
        },
        description: {
          vi: 'Bật/tắt chế độ lặp video.'
        },
        options: [
          {
            id: 'mode',
            name: {
              vi: 'chế-độ'
            },
            description: {
              vi: '<0/1/2> = tắt / bài hiện tại / toàn danh sách)'
            }
          }
        ]
      },
      {
        id: 'lyrics',
        name: {
          vi: 'lời-bài-hát'
        },
        description: {
          vi: 'Xem lời của một bài hát nào đó.'
        },
        options: [
          {
            id: 'name',
            name: {
              vi: 'tên'
            },
            description: {
              vi: 'Tên bài hát cần xem lời.'
            }
          }
        ]
      },
      {
        id: 'help',
        name: {
          vi: 'hướng-dẫn'
        },
        description: {
          vi: 'Hướng dẫn sử dụng chức năng nghe nhạc.'
        }
      },
      {
        id: 'volume',
        name: {
          vi: 'âm-lượng'
        },
        description: {
          vi: 'Điều chỉnh âm lượng của trình phát.'
        },
        options: [
          {
            id: 'volume',
            name: {
              vi: 'giá-trị'
            },
            description: {
              vi: 'Giá trị âm lượng muốn đặt. (0-100)'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'radio',
    name: {
      vi: 'radio'
    },
    description: {
      vi: 'Nghe radio trực tuyến từ nhiều nền tảng.'
    },
    options: [
      {
        id: 'channel',
        name: {
          vi: 'kênh'
        },
        description: {
          vi: 'Kênh radio muốn phát.'
        }
      }
    ]
  },
  {
    id: 'setupjoinvc',
    name: {
      vi: 'thiết-lập-tạo-join-vc'
    },
    description: {
      vi: 'Cho phép người dùng tạo kênh tạm thời khi tham gia kênh thoại.'
    },
    options: [
      {
        id: 'setup',
        name: {
          vi: 'thiết-lập'
        },
        description: {
          vi: 'Thiết lập kênh thoại.'
        },
        options: [
          {
            id: 'channel',
            name: {
              vi: 'kênh'
            },
            description: {
              vi: 'Kênh tạo kênh tạm thời.'
            }
          },
          {
            id: 'editable',
            name: {
              vi: 'có-thể-sửa-đổi'
            },
            description: {
              vi: 'Cho phép người dùng sửa đổi kênh tạm thời.'
            }
          }
        ]
      },
      {
        id: 'reset',
        name: {
          vi: 'cài-đặt-lại'
        },
        description: {
          vi: 'Cài đặt lại tất cả cài đặt kênh thoại.'
        }
      }
    ]
  },
  {
    id: 'soundboard',
    name: {
      vi: 'soundboard'
    },
    description: {
      vi: 'Phát các sound effect vui nhộn để chọc bạn bè'
    },
    options: [
      {
        id: 'sound',
        name: {
          vi: 'tên'
        },
        description: {
          vi: 'Tên sound effect cần phát.'
        }
      }
    ]
  },
  {
    id: 'baucua',
    name: {
      vi: 'bầu-cua'
    },
    description: {
      vi: 'Chơi bầu cua cá cọp.'
    }
  },
  {
    id: 'coinflip',
    name: {
      vi: 'tài-xỉu'
    },
    description: {
      vi: 'Chơi tài xỉu.'
    },
    options: [
      {
        id: 'bet',
        name: {
          vi: 'cược'
        },
        description: {
          vi: 'Số tiền bạn muốn cược.'
        }
      },
      {
        id: 'choice',
        name: {
          vi: 'lựa-chọn'
        },
        description: {
          vi: 'Lựa chọn của bạn. (tài/xỉu)'
        },
        choices: [
          {
            name: 'tài',
            value: 'heads'
          },
          {
            name: 'xỉu',
            value: 'tails'
          }
        ]
      }
    ]
  },
  {
    id: 'transfer',
    name: {
      vi: 'chuyển-khoản'
    },
    description: {
      vi: 'Chuyển khoản cho người dùng khác.'
    },
    options: [
      {
        id: 'user',
        name: {
          vi: 'người-dùng'
        },
        description: {
          vi: 'Người dùng nhận tiền.'
        }
      },
      {
        id: 'amount',
        name: {
          vi: 'số-tiền'
        },
        description: {
          vi: 'Số tiền cần chuyển.'
        }
      },
      {
        id: 'note',
        name: {
          vi: 'ghi-chú'
        },
        description: {
          vi: 'Ghi chú cho giao dịch này.'
        }
      }
    ]
  },
  {
    id: 'bank',
    name: {
      vi: 'ngân-hàng'
    },
    description: {
      vi: 'Xem các thông tin về hồ sơ tín dụng của bạn.'
    }
  },
  {
    id: 'rep',
    name: {
      vi: 'đánh-giá'
    },
    description: {
      vi: '+rep (đánh giá uy tín) người dùng khác.'
    }
  }
]
