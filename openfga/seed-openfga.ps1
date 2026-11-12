$ErrorActionPreference = "Stop"
$ApiBase = "http://localhost:8090"

Write-Host "==> Checking OpenFGA health at $ApiBase..." -ForegroundColor Cyan
$health = Invoke-RestMethod -Uri "$ApiBase/healthz" -Method Get
Write-Host "    Status: $($health.status)" -ForegroundColor Green

Write-Host "==> Creating OpenFGA store 'ekila-lms-b2c'..." -ForegroundColor Cyan
$storeResp = Invoke-RestMethod -Uri "$ApiBase/stores" -Method Post -ContentType "application/json" -Body '{"name":"ekila-lms-b2c"}'
$StoreId = $storeResp.id
Write-Host "    STORE_ID = $StoreId" -ForegroundColor Green

# JSON AST tuong ung voi ekila-lms-model.fga (Schema 1.1) de chay khong can cai fga CLI
$modelPayload = @'
{
  "schema_version": "1.1",
  "type_definitions": [
    { "type": "user" },
    {
      "type": "platform",
      "relations": {
        "system_admin": { "this": {} },
        "content_admin": { "this": {} }
      },
      "metadata": {
        "relations": {
          "system_admin": { "directly_related_user_types": [{ "type": "user" }] },
          "content_admin": { "directly_related_user_types": [{ "type": "user" }] }
        }
      }
    },
    {
      "type": "course",
      "relations": {
        "platform": { "this": {} },
        "instructor": { "this": {} },
        "enrolled": { "this": {} },
        "can_edit": {
          "union": {
            "child": [
              { "computedUserset": { "relation": "instructor" } },
              { "tupleToUserset": { "tupleset": { "relation": "platform" }, "computedUserset": { "relation": "content_admin" } } },
              { "tupleToUserset": { "tupleset": { "relation": "platform" }, "computedUserset": { "relation": "system_admin" } } }
            ]
          }
        },
        "can_publish": {
          "union": {
            "child": [
              { "tupleToUserset": { "tupleset": { "relation": "platform" }, "computedUserset": { "relation": "content_admin" } } },
              { "tupleToUserset": { "tupleset": { "relation": "platform" }, "computedUserset": { "relation": "system_admin" } } }
            ]
          }
        },
        "can_manage_questions": {
          "union": {
            "child": [
              { "computedUserset": { "relation": "instructor" } },
              { "tupleToUserset": { "tupleset": { "relation": "platform" }, "computedUserset": { "relation": "content_admin" } } },
              { "tupleToUserset": { "tupleset": { "relation": "platform" }, "computedUserset": { "relation": "system_admin" } } }
            ]
          }
        },
        "can_view_content": {
          "union": {
            "child": [
              { "computedUserset": { "relation": "enrolled" } },
              { "computedUserset": { "relation": "can_edit" } }
            ]
          }
        },
        "can_view_reports": { "computedUserset": { "relation": "can_edit" } },
        "can_learn": { "computedUserset": { "relation": "enrolled" } }
      },
      "metadata": {
        "relations": {
          "platform": { "directly_related_user_types": [{ "type": "platform" }] },
          "instructor": { "directly_related_user_types": [{ "type": "user" }] },
          "enrolled": { "directly_related_user_types": [{ "type": "user" }] }
        }
      }
    },
    {
      "type": "lesson",
      "relations": {
        "parent_course": { "this": {} },
        "preview_viewer": { "this": {} },
        "can_view": {
          "union": {
            "child": [
              { "computedUserset": { "relation": "preview_viewer" } },
              { "tupleToUserset": { "tupleset": { "relation": "parent_course" }, "computedUserset": { "relation": "can_view_content" } } }
            ]
          }
        },
        "can_track_progress": {
          "tupleToUserset": { "tupleset": { "relation": "parent_course" }, "computedUserset": { "relation": "can_learn" } }
        }
      },
      "metadata": {
        "relations": {
          "parent_course": { "directly_related_user_types": [{ "type": "course" }] },
          "preview_viewer": { "directly_related_user_types": [{ "type": "user", "wildcard": {} }] }
        }
      }
    },
    {
      "type": "quiz",
      "relations": {
        "parent_course": { "this": {} },
        "course_reporter": {
          "tupleToUserset": { "tupleset": { "relation": "parent_course" }, "computedUserset": { "relation": "can_view_reports" } }
        },
        "can_manage_questions": {
          "tupleToUserset": { "tupleset": { "relation": "parent_course" }, "computedUserset": { "relation": "can_manage_questions" } }
        },
        "can_attempt": {
          "tupleToUserset": { "tupleset": { "relation": "parent_course" }, "computedUserset": { "relation": "can_learn" } }
        }
      },
      "metadata": {
        "relations": {
          "parent_course": { "directly_related_user_types": [{ "type": "course" }] }
        }
      }
    },
    {
      "type": "quiz_attempt",
      "relations": {
        "parent_quiz": { "this": {} },
        "owner": { "this": {} },
        "can_draft_or_submit": { "computedUserset": { "relation": "owner" } },
        "can_view_result": {
          "union": {
            "child": [
              { "computedUserset": { "relation": "owner" } },
              { "tupleToUserset": { "tupleset": { "relation": "parent_quiz" }, "computedUserset": { "relation": "course_reporter" } } }
            ]
          }
        }
      },
      "metadata": {
        "relations": {
          "parent_quiz": { "directly_related_user_types": [{ "type": "quiz" }] },
          "owner": { "directly_related_user_types": [{ "type": "user" }] }
        }
      }
    },
    {
      "type": "order",
      "relations": {
        "platform": { "this": {} },
        "buyer": { "this": {} },
        "can_view": {
          "union": {
            "child": [
              { "computedUserset": { "relation": "buyer" } },
              { "tupleToUserset": { "tupleset": { "relation": "platform" }, "computedUserset": { "relation": "content_admin" } } },
              { "tupleToUserset": { "tupleset": { "relation": "platform" }, "computedUserset": { "relation": "system_admin" } } }
            ]
          }
        },
        "can_cancel": {
          "union": {
            "child": [
              { "computedUserset": { "relation": "buyer" } },
              { "tupleToUserset": { "tupleset": { "relation": "platform" }, "computedUserset": { "relation": "system_admin" } } }
            ]
          }
        }
      },
      "metadata": {
        "relations": {
          "platform": { "directly_related_user_types": [{ "type": "platform" }] },
          "buyer": { "directly_related_user_types": [{ "type": "user" }] }
        }
      }
    }
  ]
}
'@

Write-Host "==> Writing Authorization Model..." -ForegroundColor Cyan
$modelResp = Invoke-RestMethod -Uri "$ApiBase/stores/$StoreId/authorization-models" -Method Post -ContentType "application/json" -Body $modelPayload
$ModelId = $modelResp.authorization_model_id
Write-Host "    MODEL_ID = $ModelId" -ForegroundColor Green

Write-Host "==> Seeding tuples from tuples.json..." -ForegroundColor Cyan
$tuplesRaw = Get-Content -Raw -Path (Join-Path $PSScriptRoot "tuples.json")
$writeBody = "{`"writes`":{`"tuple_keys`":$tuplesRaw},`"authorization_model_id`":`"$ModelId`"}"
Invoke-RestMethod -Uri "$ApiBase/stores/$StoreId/write" -Method Post -ContentType "application/json" -Body $writeBody | Out-Null
Write-Host "    Seeded 15 tuples successfully." -ForegroundColor Green

function Test-Check($user, $rel, $obj) {
  $body = @{ tuple_key = @{ user = $user; relation = $rel; object = $obj }; authorization_model_id = $ModelId } | ConvertTo-Json -Depth 4
  $r = Invoke-RestMethod -Uri "$ApiBase/stores/$StoreId/check" -Method Post -ContentType "application/json" -Body $body
  Write-Host ("    Check({0}, {1}, {2}) => allowed={3}" -f $user, $rel, $obj, $r.allowed)
}

Write-Host "==> Running sample Check API calls against real OpenFGA server:" -ForegroundColor Cyan
Test-Check "user:khanh" "can_view" "lesson:jwt-01"
Test-Check "user:an"    "can_view" "lesson:jwt-01"
Test-Check "user:an"    "can_view" "lesson:intro-preview"
Test-Check "user:duy"   "can_manage_questions" "quiz:quiz-auth"
Test-Check "user:duy"   "can_publish" "course:spring-boot"
Test-Check "user:linh"  "can_cancel" "order:ord-khanh-01"

$listBody = @{ user = "user:khanh"; relation = "can_view"; type = "lesson"; authorization_model_id = $ModelId } | ConvertTo-Json
$listResp = Invoke-RestMethod -Uri "$ApiBase/stores/$StoreId/list-objects" -Method Post -ContentType "application/json" -Body $listBody
Write-Host "==> ListObjects(user:khanh, can_view, lesson): $($listResp.objects -join ', ')" -ForegroundColor Yellow
Write-Host "==> OpenFGA Playground UI: http://localhost:3010/playground" -ForegroundColor Green
